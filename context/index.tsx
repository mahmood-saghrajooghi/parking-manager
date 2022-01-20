import * as React from 'react'
import {QueryClientProvider, QueryClient} from 'react-query'
import {AuthProvider} from './auth-context'
const queryClient = new QueryClient();

const AppProviders: React.FC = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

export {AppProviders}
