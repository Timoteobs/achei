# Consulte https://aka.ms/customizecontainer para personalizar o contêiner de depuração e a integração com o Visual Studio.

# Estágio utilizado pelo Visual Studio no modo rápido de depuração.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Estágio de compilação do projeto.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Achei.csproj", "."]
RUN dotnet restore "./Achei.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./Achei.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Estágio de publicação do projeto para a imagem final.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Achei.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Estágio final utilizado em produção ou no modo regular do Visual Studio.
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Achei.dll"]
