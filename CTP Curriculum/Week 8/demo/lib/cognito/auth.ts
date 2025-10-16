import {
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  ConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { cognitoClient } from './client'

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
  const command = new SignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email }
    ]
  })
  
  try {
    const response = await cognitoClient.send(command)
    
    // In LocalStack, auto-confirm the user
    if (process.env.COGNITO_ENDPOINT) {
      await confirmSignUp(email, '000000')
    }
    
    return {
      success: true,
      userSub: response.UserSub,
      message: 'Sign up successful!'
    }
  } catch (error: any) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: error.message || 'Sign up failed'
    }
  }
}

/**
 * Confirm sign up (auto-confirmed in LocalStack)
 */
async function confirmSignUp(username: string, code: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: username,
    ConfirmationCode: code
  })
  
  try {
    await cognitoClient.send(command)
  } catch (error) {
    // Ignore errors in LocalStack
    console.log('Auto-confirm (LocalStack):', error)
  }
}

/**
 * Sign in a user
 */
export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  })
  
  try {
    const response = await cognitoClient.send(command)
    
    if (!response.AuthenticationResult) {
      throw new Error('Authentication failed')
    }
    
    return {
      success: true,
      accessToken: response.AuthenticationResult.AccessToken!,
      idToken: response.AuthenticationResult.IdToken!,
      refreshToken: response.AuthenticationResult.RefreshToken!,
      expiresIn: response.AuthenticationResult.ExpiresIn!
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: error.message || 'Sign in failed'
    }
  }
}

/**
 * Get user information from access token
 */
export async function getUser(accessToken: string) {
  const command = new GetUserCommand({
    AccessToken: accessToken
  })
  
  try {
    const response = await cognitoClient.send(command)
    
    const attributes = response.UserAttributes?.reduce((acc, attr) => {
      if (attr.Name && attr.Value) {
        acc[attr.Name] = attr.Value
      }
      return acc
    }, {} as Record<string, string>)
    
    return {
      success: true,
      username: response.Username!,
      attributes
    }
  } catch (error: any) {
    console.error('Get user error:', error)
    return {
      success: false,
      error: 'Invalid or expired token'
    }
  }
}
