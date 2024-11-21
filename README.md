# MegaNest

MegaNest is a project that involves multiple services, including an **Inventory** service. This document provides a comprehensive guide on setting up and running the project, configuring the database, handling migrations, and accessing management tools.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Run the Database](#2-run-the-database)
  - [3. Access PgAdmin](#3-access-pgadmin)
  - [4. Set Up Environment Variables](#4-set-up-environment-variables)
  - [5. Install Dependencies](#5-install-dependencies)
  - [6. Run the Project](#6-run-the-project)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Ensure you have the following installed on your machine:

- **Docker** and **Docker Compose**: for running the PostgreSQL database as a container.
- **pnpm**: for dependency management and project scripts.

## Getting Started

### 1. Clone the Repository

Clone the **MegaNest** repository to your local machine:

```bash
git clone https://github.com/farhan-nahid/megaNest
cd megaNest
```

### 2. Run the Database

To start the PostgreSQL database, use Docker Compose:

```bash
sudo docker-compose up
```

This command will start the database service defined in your `docker-compose.yaml` file.

### 3. Access PgAdmin

To manage the PostgreSQL database, access PgAdmin in your web browser:

- Go to http://localhost:5050
- Use the credentials provided in the `docker-compose.yaml` file or `.env` file to log in.
- Use server as `host.docker.internal` or `postgres`

### 4. Set Up Environment Variables

Configure environment variables by creating a `.env` file:

- Copy the example `.env` file to get started::

```bash
cp .env.example .env
```

- Open the `.env` file and configure the necessary variables, such as database credentials, application ports, and any other required settings.

### 5. Install Dependencies

Use `pnpm` to install the required dependencies:

```bash
pnpm i
```

This will install all dependencies required to run the project.

### 6. Run the Project

To start the development server, use the following command:

```bash
pnpm dev
```

The project will now start in development mode. Review the console output to confirm that all services have started successfully.

## Contributing

We welcome contributions to MegaNest! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -am 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a pull request.

Please ensure your code follows our project standards and is thoroughly tested.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Service Endpoints

### Product

```bash
http://localhost:4001

```

### Inventory

```bash
http://localhost:4002

```

### Auth

```bash
http://localhost:4003

```

### User

```bash
http://localhost:4004

```

### Email

```bash
http://localhost:4005

```
