# Blood Group Collector

A web application designed to collect and manage blood group information, built with Node.js and PostgreSQL.

## Project Overview

The Blood Group Collector is a full-stack application that helps collect, store, and manage blood donor information. This tool can be used by blood banks, hospitals, or community organizations to maintain a database of blood donors.

## Tech Stack

- **Frontend**: Node.js
- **Backend**: Node.js
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Web Server**: Nginx

## Project Structure

```
blood-group-collector/
├── backend/        # Backend Node.js server code
├── database/       # Database schema and scripts
├── frontend/       # Frontend Node.js application
├── server.js       # Main server entry point
├── docker-compose.yaml       # Docker Compose configuration
├── Dockerfile      # Docker configuration for the application
├── package.json    # Node.js dependencies
├── package-lock.json  # Locked dependencies
└── public/         # Static assets
    └── index.html  # Main HTML entry point
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/abdullah-al-mamun504/blood-group-collector.git
   cd blood-group-collector
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the application at:
   ```
   http://localhost:80
   ```

## Docker Configuration

The application uses Docker for containerization with the following components:
- Node.js container for the application
- PostgreSQL container for the database
- Nginx container as a reverse proxy

The Docker Compose file orchestrates these containers to work together seamlessly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Steps to contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Abdullah Al Mamun - a.almamun504@gmail.com

Project Link: [https://github.com/abdullah-al-mamun504/blood-group-collector](https://github.com/abdullah-al-mamun504/blood-group-collector)
