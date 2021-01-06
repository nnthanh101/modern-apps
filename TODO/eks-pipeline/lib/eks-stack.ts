import * as cdk from '@aws-cdk/core';
import { Vpc, InstanceType, InstanceClass, InstanceSize, SubnetType, SecurityGroup, Port } from '@aws-cdk/aws-ec2';
import { Cluster, KubernetesVersion, } from '@aws-cdk/aws-eks';
import { ManagedPolicy } from '@aws-cdk/aws-iam';
import { Role, AccountRootPrincipal } from '@aws-cdk/aws-iam';
import { CfnSubnetGroup, CfnCacheCluster } from '@aws-cdk/aws-elasticache';
import { DatabaseClusterEngine, AuroraMysqlEngineVersion, DatabaseCluster } from '@aws-cdk/aws-rds';

const EKS_POLICIES: string[] = [
  "arn:aws:iam::aws:policy/AmazonEKSServicePolicy",
  "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
];


export class EksStack extends cdk.Stack {
  public readonly eksCluster: Cluster;
  public readonly redisCluster: CfnCacheCluster;
  public readonly rds: DatabaseCluster;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new Vpc(this, 'TheVPC', {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          // Using isolated subnet instead of a private subnet to saves cost of a NAT-Gateway inside our VPC.
          cidrMask: 26,
          name: 'isolated-database',
          subnetType: SubnetType.ISOLATED, //No resources will be created for this subnet, but the IP range will be kept available for future creation of this subnet
        },
        {
          cidrMask: 24,
          name: 'public-dmz',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-application',
          subnetType: SubnetType.PRIVATE,
        },
      ],
    })

    this.eksCluster = this.createEKSCluster(vpc);
    this.redisCluster = this.createRedis(vpc, this.eksCluster);
    this.rds = this.createRDS(vpc, this.eksCluster);
  }


  private createEKSCluster(vpc: Vpc) {

    const clusterAdmin = new Role(this, 'EKS-AdminRole', {
      assumedBy: new AccountRootPrincipal()
    });
    clusterAdmin.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'));

    const eksSecurityGroup = new SecurityGroup(this, 'EKSSecurityGroup', {
			vpc,
			securityGroupName: "EKS-SG",
			description: 'Allow http access to rds from anywhere',
			allowAllOutbound: true,
		});
		// eksSecurityGroup.connections.addSecurityGroup(eksSecurityGroup);
		// eksSecurityGroup.connections.allowDefaultPortFromAnyIpv4('22');
    // create eks cluster with amd nodegroup
    const cluster = new Cluster(this, 'EKS', {
      vpc: vpc,
      version: KubernetesVersion.V1_18,
      defaultCapacityInstance: InstanceType.of(InstanceClass.M5, InstanceSize.LARGE),
      defaultCapacity: 1,
      outputClusterName: true,
      mastersRole: clusterAdmin,
      securityGroup: eksSecurityGroup
    });
    cluster.connections.allowDefaultPortFromAnyIpv4('22');

    // add arm/graviton nodegroup
    cluster.addNodegroupCapacity('graviton', {
      maxSize:2,
      desiredSize: 1,
      instanceType: InstanceType.of(InstanceClass.M6G, InstanceSize.LARGE),
      nodegroupName: 'graviton',
      nodeRole: cluster.defaultNodegroup?.role
    });

    // add secret access to eks node role
    cluster.defaultNodegroup?.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite'))

    // add helm charts
    const ingress = cluster.addHelmChart('LBIngress', {
      chart: 'aws-load-balancer-controller',
      release: "aws-load-balancer-controller",
      repository: "https://aws.github.io/eks-charts",
      namespace: "kube-system", values: {
        "clusterName": cluster.clusterName,
        "serviceAccount.name": "aws-load-balancer-controller",
        "serviceAccount.create": "false"
      }
    })
    return cluster
  }

  private createRedis(vpc: Vpc, cluster: Cluster) {
    // create subnet group
    const subnet_group = new CfnSubnetGroup(this, "RedisClusterPrivateSubnetGroup", {
      cacheSubnetGroupName: 'redis-springboot-multiarch',
      subnetIds: vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE,
      }).subnetIds,
      description: 'springboot multiarch demo',
    })

    const security_group = new SecurityGroup(this,
      'RedisSecurityGroup',
      {
        vpc: vpc,
        description: 'Allow redis connection from eks',
        allowAllOutbound: true
      }
    );
    cluster.connections.allowTo(security_group, Port.tcp(6379));
    // create redis cluster
    const redis = new CfnCacheCluster(this, 'RedisCluster', {
      engine: 'redis',
      cacheNodeType: 'cache.t2.small',
      numCacheNodes: 1,
      clusterName: 'redis-springboot-multiarch',
      vpcSecurityGroupIds: [security_group.securityGroupId],
      cacheSubnetGroupName: subnet_group.cacheSubnetGroupName
    });
    redis.addDependsOn(subnet_group);
    return redis;
  }

  private createRDS(vpc: Vpc, cluster: Cluster) {
    const rdsCluster = new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_03_4 }),
      instanceProps: {
        instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.SMALL),
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE
        },
        vpc: vpc
      }
    })
    cluster.connections.allowTo(rdsCluster, Port.tcp(3305));
    return rdsCluster;
  }
}