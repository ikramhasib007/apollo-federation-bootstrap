import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

const getUserId = (request: any, requireAuth = true) => {
  const header = request?.headers.get('authorization')

  if (header) {
    try {
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
      // @ts-expect-error -> The user ID will exist in the header
      return decoded.userId as string
    } catch (error: any) {
      throw new GraphQLError('Unable to access')
    }
  }
  if (requireAuth) throw new GraphQLError('Authentication required')

  return null
}

export const getRequestId = (request: any, requireAuth = true) => {
  const header = request?.headers.get('x-authorization')

  if (header) {
    try {
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.SUBGRAPH_ACCESS_TOKEN_SECRET || '')
      // @ts-expect-error -> The user ID will exist in the header
      return decoded.requestId as string
    } catch (error: any) {
      throw new GraphQLError('Unable to verify request')
    }
  }
  if (requireAuth) throw new GraphQLError('X-Authentication required')

  return null
}

export default getUserId
