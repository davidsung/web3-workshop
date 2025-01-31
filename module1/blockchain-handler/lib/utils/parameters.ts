// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { SSM } from 'aws-sdk';
import logger from './logger';
import { Address } from 'abitype';

const ssm: AWS.SSM = new SSM({ region: process.env.AWS_REGION });

export async function putSSMParameter(parameterName: string, parameterValue: string): Promise<void> {
  await ssm.putParameter({
    Name: parameterName,
    Value: parameterValue,
    Type: 'String',
    Overwrite: true
  }).promise();
}

export async function getSSMParameter(parameterName: string): Promise<string> {
  try {
    const parameterStoreData = await ssm.getParameter({ Name: parameterName }).promise();

    return parameterStoreData.Parameter?.Value as string;
  } catch (error) {
    logger.error(`Error getting parameter ${parameterName} from Parameter Store`);
    throw error;
  }
}

export function getEnvironmentVariable(variableName: string) {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`Environment variable ${variableName} not found`);
  }

  return value;
}

export function getSigningLambdaARN(): string {
  return getEnvironmentVariable('ARN_LAMBDA_SIGNING');
}

export function getS3AssetBucketARN(): string {
  return getEnvironmentVariable('ARN_S3_ASSET_BUCKET');
}

export function getChainID() {
  return getEnvironmentVariable('CHAIN_ID');
}

export function getChainName() {
  const chainId: string = getEnvironmentVariable('CHAIN_ID');
  const chainNames = {
    '5': 'goerli',
    '11155111': 'sepolia',
    '80001': 'mumbai',
    '80002': 'amoy'
  };

  return chainNames[chainId] || 'mumbai';
}

export function getEntryPointAddress(): Address {
  return getEnvironmentVariable('AA_ENTRY_POINT_ADDRESS') as Address;
}

export function getWalletFactoryAddress(): Address {
  return getEnvironmentVariable('AA_WALLET_FACTORY_ADDRESS') as Address;
}

export function getAPIKey(chainName: string) {
  return getEnvironmentVariable(`AA_API_KEY_${chainName}`);
}

export function getAlchemyPolicyID(chainName: string) {
  return getEnvironmentVariable(`AA_POLICY_ID_${chainName}`);
}
