FROM golang:1.26-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /velora ./cmd/server
FROM alpine:3.21
RUN adduser -D app
USER app
COPY --from=build /velora /velora
EXPOSE 8080
ENTRYPOINT ["/velora"]
