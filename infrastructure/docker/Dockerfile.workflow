FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY services/workflow-service/package.json ./services/workflow-service/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
RUN npm install --workspace=@agentflow/workflow-service --workspace=@agentflow/shared-types --workspace=@agentflow/shared-utils

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY packages/ ./packages/
COPY scripts/ ./scripts/
COPY services/workflow-service/ ./services/workflow-service/
WORKDIR /app/services/workflow-service
RUN npm run build

FROM base AS runner
COPY --from=build /app/services/workflow-service/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 4002
CMD ["node", "dist/server.js"]
