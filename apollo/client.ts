import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject, createHttpLink } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>;

// Get GraphQL endpoint with fallback
const getGraphQLUri = () => {
	return process.env.REACT_APP_API_GRAPHQL_URL || 
	       process.env.NEXT_PUBLIC_API_GRAPHQL_URL || 
	       'http://localhost:3005/graphql';
};

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

// Custom WebSocket client
class LoggingWebSocket {
	private socket: WebSocket | null = null;

	constructor(url: string) {
		try {
			this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
			socketVar(this.socket);

			this.socket.onopen = () => {
				if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
					console.log('WebSocket connection established');
				}
			};

			this.socket.onmessage = (msg) => {
				if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
					console.log('WebSocket message:', msg.data);
				}
			};

			this.socket.onerror = (error) => {
				// Silently handle WebSocket errors (backend might not be running)
				if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
					console.log('WebSocket connection error (this is normal if backend is not running)');
				}
			};

			this.socket.onclose = () => {
				// Silently handle WebSocket close
			};
		} catch (error) {
			// Silently handle WebSocket creation errors
			if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
				console.log('WebSocket initialization failed (this is normal if backend is not running)');
			}
		}
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(data);
		}
	}

	close() {
		if (this.socket) {
			this.socket.close();
		}
	}
}

function createIsomorphicLink() {
	const graphQLUri = getGraphQLUri();
	
	// Auth link that adds JWT token to headers
	const authLink = new ApolloLink((operation, forward) => {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				...getHeaders(),
			},
		}));
		if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
			console.log('GraphQL Request:', operation.operationName || 'Unknown');
		}
		return forward(operation);
	});

	// Error link for handling GraphQL and network errors
	const errorLink = onError(({ graphQLErrors, networkError, response }) => {
		if (graphQLErrors) {
			graphQLErrors.map(({ message, locations, path, extensions }) => {
				if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
					// Only log Location and Path if they exist
					const locationStr = locations ? `, Location: ${JSON.stringify(locations)}` : '';
					const pathStr = path ? `, Path: ${JSON.stringify(path)}` : '';
					console.log(`[GraphQL error]: Message: ${message}${locationStr}${pathStr}`);
				}
				// Only show user-facing errors for non-network issues
				if (typeof window !== 'undefined' && !message.includes('input') && !message.includes('Failed to fetch')) {
					sweetErrorAlert(message);
				}
			});
		}
		// Suppress connection refused errors (backend not running)
		if (networkError) {
			const errorMessage = networkError.message || String(networkError);
			// Only log if it's not a connection refused error
			if (!errorMessage.includes('Failed to fetch') && !errorMessage.includes('ERR_CONNECTION_REFUSED')) {
				if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
					console.log(`[Network error]: ${networkError}`);
				}
			}
		}
		// @ts-ignore
		if (networkError?.statusCode === 401) {
			// Handle unauthorized error
		}
	});

	// Server-side rendering: use simple HTTP link
	if (typeof window === 'undefined') {
		const httpLink = createHttpLink({
			uri: graphQLUri,
		});
		return from([errorLink, authLink, httpLink]);
	}

	// Client-side: use upload link with WebSocket support
	// @ts-ignore
	const uploadLink = new createUploadLink({
		uri: graphQLUri,
	});

	/* WEBSOCKET SUBSCRIPTION LINK */
	const wsLink = new WebSocketLink({
		uri: process.env.REACT_APP_API_WS || process.env.NEXT_PUBLIC_API_WS || 'ws://localhost:3005',
		options: {
			reconnect: false,
			timeout: 30000,
			connectionParams: () => {
				return { headers: getHeaders() };
			},
		},
		webSocketImpl: LoggingWebSocket,
	});

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
		},
		wsLink,
		authLink.concat(uploadLink),
	);

	return from([errorLink, tokenRefreshLink, splitLink]);
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3005/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/