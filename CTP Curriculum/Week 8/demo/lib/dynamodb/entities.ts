import { Entity, Table } from 'dynamodb-toolbox'
import { docClient } from './client'

// Define the UserSettings table
export const UserSettingsTable = new Table({
  name: process.env.DYNAMODB_TABLE_NAME || 'UserSettings',
  partitionKey: 'userId',
  sortKey: 'settingKey',
  DocumentClient: docClient
})

// Define the UserSetting entity
export const UserSetting = new Entity({
  name: 'UserSetting',
  attributes: {
    userId: { partitionKey: true, type: 'string' },
    settingKey: { sortKey: true, type: 'string' },
    value: { type: 'map' },
    updatedAt: { 
      type: 'string', 
      default: () => new Date().toISOString() 
    }
  },
  table: UserSettingsTable
})

// TypeScript types
export interface UserSettingItem {
  userId: string
  settingKey: string
  value: any
  updatedAt?: string
}

export interface UserSettings {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large' | 'x-large'
  highContrast: boolean
  reducedMotion: boolean
  profilePhoto?: string
}
