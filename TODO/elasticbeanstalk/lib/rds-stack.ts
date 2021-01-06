import {Stack, Construct, StackProps, Duration, SecretValue, CfnOutput, Environment} from '@aws-cdk/core';
import {
	InstanceType
	, InstanceClass
	, InstanceSize
	, SubnetType
	, Vpc
	, SecurityGroup
	} from '@aws-cdk/aws-ec2';
import {
	StorageType
	, DatabaseInstance
	, DatabaseInstanceEngine
	, OracleLegacyEngineVersion
	, LicenseModel
} from '@aws-cdk/aws-rds';
import {getGetVpc} from './vpc-stack';

// import {$log} from "@tsed/logger";
// $log.level = "debug";
// $log.name = "VPC";


export interface RDSMySQLStackProps {
	readonly rdsInstanceName: String;
	readonly rdsCredentiallUser: String;
	readonly rdsCredentialPass: String;
	readonly rdsDatabaseName: String;
	readonly env?: Environment;
	readonly tags?: {
	  [key: string]: string;
	};
  }
export class RDSMySQLStack extends Stack {
	readonly jdbcConnection : String;
	constructor(scope: Construct, id: string, props?: RDSMySQLStackProps) {
		super(scope, id, props);

	const vpc = getGetVpc(this);
	const rdsInstance = new DatabaseInstance(this, 'travelbuddy', {
		engine: DatabaseInstanceEngine.MYSQL,
		// micro database should be available on free tier
		instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO),
		credentials : {username:props?.rdsCredentiallUser+'', password: SecretValue.plainText(props?.rdsCredentialPass+''),},
		vpc: vpc,
		vpcPlacement: {subnetType: SubnetType.PUBLIC},
		storageType: StorageType.GP2,
		storageEncrypted: true,
		allocatedStorage: 20, // GiB
		backupRetention: Duration.days(1),
		maxAllocatedStorage: 30, //GiB
		instanceIdentifier: props?.rdsDatabaseName+'',
		databaseName: props?.rdsDatabaseName+'',
		// None production we can live without multiple availability zones
		multiAz: false,
		autoMinorVersionUpgrade: false
	});
	this.jdbcConnection = 'jdbc:mysql://'+rdsInstance.dbInstanceEndpointAddress+':'+rdsInstance.dbInstanceEndpointPort+'/travelbuddy?useSSL=false&autoReconnect=true';
	new CfnOutput(this, 'JDBC_CONNECTION_STRING', { value: this.jdbcConnection.toString() })

	const rdsSecurityGroup = new SecurityGroup(this, 'MySQLSecurityGroup', {
		vpc,
		securityGroupName: "Mysql-SG",
		description: 'Allow http access to rds from anywhere',
		allowAllOutbound: true,
	  });
	rdsInstance.connections.addSecurityGroup(rdsSecurityGroup);
	rdsInstance.connections.allowDefaultPortFromAnyIpv4('3306');
}
}