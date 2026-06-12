import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import client from './lib/apolloClient.ts'
import { ApolloProvider } from '@apollo/client/react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider  client={client}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
