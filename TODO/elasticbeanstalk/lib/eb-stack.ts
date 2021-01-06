import {Stack, Construct, CfnOutput, Environment} from '@aws-cdk/core';
import {CfnApplication, CfnEnvironment, CfnApplicationVersion} from '@aws-cdk/aws-elasticbeanstalk';
import {Asset} from '@aws-cdk/aws-s3-assets' ;
import {SecurityGroup, InstanceClass, InstanceType, InstanceSize, AmazonLinuxImage}  from '@aws-cdk/aws-ec2';
import {Role, CfnInstanceProfile} from '@aws-cdk/aws-iam';
import {ServicePrincipal } from '@aws-cdk/aws-iam';
import {envVars } from './config';
import {getGetVpc} from './vpc-stack';
import {ApplicationLoadBalancer} from '@aws-cdk/aws-elasticloadbalancingv2';
import {AutoScalingGroup} from '@aws-cdk/aws-autoscaling';

export interface EBStackProps {
  readonly jdbcConnectioin: String;
  readonly jdbcUser: String;
  readonly jdbcPassword: String;
  readonly env?: Environment;
  readonly tags?: {
    [key: string]: string;
  };
}
// const app = new cdk.App();
export class EBStack extends Stack {
  constructor(scope: Construct, id: string, props?: EBStackProps) {
    super(scope, id, props);

		const vpc = getGetVpc(this);

    // Construct an S3 asset from the ZIP located from directory up.cd
    const elbZipArchive = new Asset(this, 'MyElbAppZip', {
      path: '${__dirname}/../../elasticbeanstalk/TravelBuddy/target/travelbuddy.war',
    });
    new CfnOutput(this, 'S3BucketSourceCode', { value: elbZipArchive.s3BucketName })

    const appName = envVars.EB_APP_NAME;
    const app = new CfnApplication(this, 'Application', {
        applicationName: appName,
    });

    // This is the role that your application will assume
    const ebRole = new Role(this, 'CustomEBRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });

    // This is the Instance Profile which will allow the application to use the above role
    const ebInstanceProfile = new CfnInstanceProfile(this, 'CustomInstanceProfile', {
      roles: [ebRole.roleName],
    });

    const albSecurityGroup = new SecurityGroup(this, 'albSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'alb-sg',
      vpc: vpc,
    });
    //  albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    // albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    
    const lb = new ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup, // Optional - will be automatically created otherwise
    });

    const listener = lb.addListener('Listener', {
      port: 80,
      // 'open: true' is the default, you can leave it out if you want. Set it to 'false' and use `listener.connections` if you want to be selective
      // about who can access the load balancer.
      open: true,
    });

    const asg = new AutoScalingGroup(this, 'ASG', {
        vpc:vpc,
        instanceType:  InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
        machineImage: new AmazonLinuxImage(),
        }​​​​​​​​);
        listener.addTargets('ApplicationFleet', {
      port: 8080,
      targets: [asg]
    });

    const optionSettingProperties: CfnEnvironment.OptionSettingProperty[] = [
      {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'SecurityGroups',
          value: albSecurityGroup.securityGroupId,
      },
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'InstanceType',
        value: InstanceClass.C3+'.'+InstanceSize.LARGE,
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'VPCId',
        value: vpc.vpcId,
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'ELBSubnets',
        value: vpc.publicSubnets.map(value => value.subnetId).join(','),
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'Subnets',
        value: vpc.privateSubnets.map(value => value.subnetId).join(','),
      },
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        // Here you could reference an instance profile by ARN (e.g. myIamInstanceProfile.attrArn)
        // For the default setup, leave this as is (it is assumed this role exists)
        // https://stackoverflow.com/a/55033663/6894670
        value: ebInstanceProfile.attrArn,
      },
      {
          namespace: 'aws:elasticbeanstalk:container:tomcat:jvmoptions',
          optionName: 'Xms',
          value: '256m',
      },
      {
        namespace: 'aws:elasticbeanstalk:container:tomcat:jvmoptions',
        optionName: 'Xmx',
        value: '512m  ',
      },
      {
        namespace: 'aws:elasticbeanstalk:environment:proxy',
        optionName: 'ProxyServer',
        value: 'apache',
      },
      { namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'EC2KeyName',
        value: 'ee-default-keypair'
      },
      //Database
      { namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'JDBC_PWD',
        value: props?.jdbcPassword.toString()
      },
      { namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'JDBC_UID',
        value: props?.jdbcUser.toString(),
      },
      { namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'JDBC_CONNECTION_STRING',
        // value: 'jdbc:mysql://travelbuddy.cszuvqcfam1t.ap-southeast-1.rds.amazonaws.com:3306/travelbuddy?useSSL=false&autoReconnect=true'
        value: props?.jdbcConnectioin.toString(),
      },
      //Loadbalance
      { namespace: 'aws:elasticbeanstalk:environment',
        optionName: 'LoadBalancerType',
        value: 'application',
      },
    ];

    // Create an app version from the S3 asset defined above
    // The S3 "putObject" will occur first before CF generates the template
    const appVersionProps = new CfnApplicationVersion(this, 'AppVersion', {
      applicationName: appName,
      sourceBundle: {
          s3Bucket: elbZipArchive.s3BucketName,
          s3Key: elbZipArchive.s3ObjectKey,
      },
    }); 

    // eslint-disable-next-line @typescript-eslint/no-unused-vars  aws elasticbeanstalk list-available-solution-stacks (command)
    const elbEnv = new CfnEnvironment(this, 'Environment', {
      environmentName: 'MyEnvironment',
      applicationName: app.applicationName || appName,
      solutionStackName: '64bit Amazon Linux 2018.03 v3.4.1 running Tomcat 8.5 Java 8',
      optionSettings: optionSettingProperties,
      // cnamePrefix:'ep',
      description:'Application is deployed in elastic beanstalk with tomcat',
      // This line is critical - reference the label created in this same stack
      versionLabel: appVersionProps.ref,
    });
    // Also very important - make sure that `app` exists before creating an app version
    appVersionProps.addDependsOn(app);
  }
}