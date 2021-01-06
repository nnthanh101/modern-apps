import core = require("@aws-cdk/core");
import ec2 = require("@aws-cdk/aws-ec2");

/**
 * Deploy appropriate AWS Resources (ELB, EC2, RDS Databases) to the Production or Development VPC. 
 * Separating the Production and Development VPCs allows you to manage the environments with different levels of controls and restrictions.
 * The Management VPC only for AWS Resources that more operational in nature, like a DevOps tool - Jenkins & GitLab, Active Directory, Security Compliance.
 * Need a `Server` where I'm going to test out installing an application to test out on my own or show to a coworker 
 * ├── Development VPC, Private Subnet
 * Restoring an `RDS` snapshot in Development into Production
 * ├── Production VPC, Isolated Subnet
 * Launching an `Application Load Balancer` to try installing a custom TLS certificate
 * ├── Development VPC, Public Subnet
 * Standing up a DevOps tool like `Jenkins` or `Gitlab` to automate deployments into Production and Development 
 * ├── Management VPC, Private Subnet
 * Standing up and Okta Cloud Connect appliance or `Active Directory`
 * ├── Management VPC, Private Subnet 
 */
export class AwsVpc extends core.Construct {
  
  public readonly ProductionVpc:  ec2.Vpc;
  public readonly ManagmentVPC:   ec2.Vpc;
  public readonly DevelopmentVpc: ec2.Vpc;
  public readonly MangementVpcDnsIp: string;
  
  constructor(scope: core.Construct, id: string, props: core.StackProps) {
    super(scope, id);

    /**
     * Production-VPC: Deploy the Production AWS Resources (ELB, EC2, ElasticSearch, ElasticCache, RDS Databases) to the Production VPC.
     */
    this.ProductionVpc = new ec2.Vpc(this, 'Production-VPC', {
        cidr: '10.50.0.0/18',          
        maxAzs: 2,    
        natGateways: 1,
        subnetConfiguration: [
          { 
            cidrMask: 24,
            subnetType: ec2.SubnetType.PUBLIC,    
            name: 'Public-DMZ',
          },
          {
            cidrMask: 24,
            name: 'Private-Application',
            subnetType: ec2.SubnetType.PRIVATE,
          },
          {
            cidrMask: 24,
            name: 'Isolated-Database',
            subnetType: ec2.SubnetType.ISOLATED,    
          }
        ],
        gatewayEndpoints: {
          S3: {
            service: ec2.GatewayVpcEndpointAwsService.S3,
          }
        }
    });
  
    /**
     * Development-VPC: for Dev/Test purpose. 
     * Separating the Production and Development VPCs allows you to manage the environments with different levels of controls and restrictions.
     */
    this.DevelopmentVpc = new ec2.Vpc(this, 'Development-VPC', {
        cidr: '10.60.0.0/18',          
        maxAzs: 2,    
        natGateways: 1,
        subnetConfiguration: [
          {
            cidrMask: 24,
            subnetType: ec2.SubnetType.PUBLIC,    
            name: 'Public-DMZ',
          },
          {
            cidrMask: 24,
            name: 'Private-Application',
            subnetType: ec2.SubnetType.PRIVATE,
          },
          {
            cidrMask: 24,
            name: 'Isolated-Database',
            subnetType: ec2.SubnetType.ISOLATED,    
          }
        ],
        gatewayEndpoints: {
          S3: {
            service: ec2.GatewayVpcEndpointAwsService.S3,
          }
        }
    });
  
    /**
     * Managment-VPC: Jenkins/Gitlab, Active Directory
     */
    let managmentCidr = '10.70.0.0/18';
    let baseRangeAndMask = managmentCidr.split('/');
    let baseRangeOctets = baseRangeAndMask[0].split('.');
    let baseOctetPlusTwo = Number(baseRangeOctets[3]) + 2;
    this.MangementVpcDnsIp = `${baseRangeOctets[0]}.${baseRangeOctets[1]}.${baseRangeOctets[2]}.${baseOctetPlusTwo}`;

    this.ManagmentVPC = new ec2.Vpc(this, 'Managment-VPC', {
        cidr: managmentCidr,          
        maxAzs: 2,    
        natGateways: 1,
        subnetConfiguration: [
          {
            cidrMask: 24,
            subnetType: ec2.SubnetType.PUBLIC,    
            name: 'Public-DMZ',
          },
          {
            cidrMask: 24,
            name: 'Private-Application',
            subnetType: ec2.SubnetType.PRIVATE,
          }
        ]
    });
      
    /** VPC Peering: Management-VPC to Production-VPC */
    const _ManagementToProductionPeering = new ec2.CfnVPCPeeringConnection(this, 'ManagmentToProductionPeering', {
        vpcId: this.ManagmentVPC.vpcId,
        peerVpcId: this.ProductionVpc.vpcId
    });
  
    /** VPC Peering: Management-VPC to Development-VPC */
    const _ManagementToDevelopmentPeering = new ec2.CfnVPCPeeringConnection(this, 'ManagmentToDevelopmentPeering', {
        vpcId: this.ManagmentVPC.vpcId,
        peerVpcId: this.DevelopmentVpc.vpcId
    });
  
    const publicSubnetSelection = { subnetType: ec2.SubnetType.PUBLIC };
    const privateSubnetSelection = { subnetType: ec2.SubnetType.PRIVATE };
    const isolatedSubnetSelection = { subnetType: ec2.SubnetType.ISOLATED };
    
    /**
     * Management <-> Dev
     */
    this.createRoutesForSubnetClass(`MgmtPublicToDev`,this.ManagmentVPC, publicSubnetSelection, this.DevelopmentVpc, _ManagementToDevelopmentPeering );
    this.createRoutesForSubnetClass(`MgmtPrivateToDev`,this.ManagmentVPC, privateSubnetSelection, this.DevelopmentVpc, _ManagementToDevelopmentPeering );
    this.createRoutesForSubnetClass(`DevPublicToMgmt`,this.DevelopmentVpc, publicSubnetSelection, this.ManagmentVPC, _ManagementToDevelopmentPeering );
    this.createRoutesForSubnetClass(`DevPrivateToMgmt`,this.DevelopmentVpc, privateSubnetSelection, this.ManagmentVPC, _ManagementToDevelopmentPeering );
    this.createRoutesForSubnetClass(`DevIsolatedToMgmt`,this.DevelopmentVpc, isolatedSubnetSelection, this.ManagmentVPC, _ManagementToDevelopmentPeering );

    /**
     * Management <-> Prod 
     */ 
    this.createRoutesForSubnetClass(`MgmtPublicToProd`,this.ManagmentVPC, publicSubnetSelection, this.ProductionVpc, _ManagementToProductionPeering );
    this.createRoutesForSubnetClass(`MgmtPrivateToProd`,this.ManagmentVPC, privateSubnetSelection, this.ProductionVpc, _ManagementToProductionPeering );
    this.createRoutesForSubnetClass(`ProdPublicToMgmt`,this.ProductionVpc, publicSubnetSelection, this.ManagmentVPC, _ManagementToProductionPeering );
    this.createRoutesForSubnetClass(`ProdPrivateToMgmt`,this.ProductionVpc, privateSubnetSelection, this.ManagmentVPC, _ManagementToProductionPeering );
    //this.createRoutesForSubnetClass(`ProdIsolatedToMgmt`,developmentVPC, isolatedSubnetSelection, managementVPC, _ManagementToDevelopmentPeering );
  }

  /**
   * 
   * @param name 
   * @param sourceVPC 
   * @param sourceSubnetType 
   * @param destinationVPC 
   * @param peeringConnection 
   */
  private createRoutesForSubnetClass(name: string, sourceVPC: ec2.Vpc, sourceSubnetType: any, destinationVPC: ec2.Vpc, peeringConnection: ec2.CfnVPCPeeringConnection ){
    
    sourceVPC.selectSubnets(sourceSubnetType).subnets.forEach((subnet, index) => {
      new ec2.CfnRoute(this, `${name}-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: destinationVPC.vpcCidrBlock,
        vpcPeeringConnectionId: peeringConnection.ref
      });
    });
  }
}
