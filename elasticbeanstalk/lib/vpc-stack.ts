import {Stack, Construct, StackProps} from '@aws-cdk/core';
import {Vpc, SubnetType, IVpc}  from '@aws-cdk/aws-ec2';
import { envVars } from './config';

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    getCreateVpc(this);
  }
}

export function getCreateVpc(stack: Stack): Vpc {
	
	/** Use an existing VPC or create a new one */
	const vpc =  new Vpc(stack, envVars.VPC_NAME_DEVELOPMENT, 
		{
			cidr: envVars.VPC_CIDR,
			maxAzs: 2,
			natGateways: 1,
			subnetConfiguration: [
				{
			// Using isolated subnet instead of a private subnet to saves cost of a NAT-Gateway inside our VPC.
				cidrMask: envVars.VPC_ISOLATED_CIDRMASK,
				name: 'isolated',
				subnetType: SubnetType.ISOLATED, //No resources will be created for this subnet, but the IP range will be kept available for future creation of this subnet
				},
				{
					cidrMask: envVars.VPC_PUBLIC_CIDRMASK,
					name: 'public',
					subnetType: SubnetType.PUBLIC,
				},
				{
					cidrMask: envVars.VPC_PRIVATE_CIDRMASK,
					name: 'private',
					subnetType: SubnetType.PRIVATE,
				}, 
			],
			enableDnsHostnames:true,
			enableDnsSupport:true,
		}
	)
	return vpc
}

export function getGetVpc(stack: Stack): IVpc {
	const vpc = Vpc.fromLookup(
		stack, 
		envVars.VPC_NAME_DEVELOPMENT, {
		vpcName: 'vpc/'+envVars.VPC_NAME_DEVELOPMENT,
	});

	// const vpc = stack.node.tryGetContext('use_default_vpc') === '1' ?
	// 		ec2.Vpc.fromLookup(stack, envVars.VPC_NAME_DEVELOPMENT, { isDefault: true }) :
	// 			stack.node.tryGetContext('use_vpc_id');
	// $log.info(vpc)
	return vpc;
}
