# Flight Delay Prediction System

A comprehensive web application for predicting and analyzing flight delays using real-time weather data and advanced database analytics.

## Features

### Core Functionality
- **Flight Management**: Complete CRUD operations for flight data
- **Intelligent Search**: Advanced flight search by flight number with detailed status information
- **Real-time Analytics**: Weather impact analysis on flight delays
- **Performance Metrics**: Airline performance comparison during normal vs. weather conditions

### Advanced Database Features
- **Stored Procedures**: Multi-result set procedures for complex flight delay analysis
- **Transactions**: ACID-compliant transactions with proper isolation levels
- **Triggers**: Automated delay prediction generation
- **Advanced Queries**: Complex analytical queries with joins, subqueries, and aggregations

### Analytics & Visualizations
- Weather impact analysis with distance-based categorization
- Temporal analysis of delay patterns throughout the day
- Airline performance comparison during weather events
- Interactive charts and data visualizations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Node.js, Next.js API Routes
- **Database**: MySQL with connection pooling
- **Form Handling**: React Hook Form with Zod validation

## Database Schema

The system uses 8 relational tables:
- `User` - User authentication and profile information
- `Airline` - Airline details and codes
- `Airport` - Airport information with geolocation data
- `Flight` - Scheduled flight information
- `Flight_Status` - Real-time flight status and delays
- `Delay_Prediction` - AI-generated delay predictions
- `Weather_Event` - Weather events affecting flights
- `User_Alert` - User notification preferences

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flight-delay-system.git
cd flight-delay-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Configure your database connection:
```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
DB_SSL=true
```

4. Set up the database
```bash
# Run the SQL scripts to create tables and insert sample data
mysql -u your-username -p your-database-name < database/schema.sql
mysql -u your-username -p your-database-name < database/sample-data.sql
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── flights/                  # Flight management pages
│   ├── advanced/                 # Advanced database features
│   ├── advanced-analysis/        # Analytics dashboard
│   └── search/                   # Flight search functionality
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   ├── flight-form.tsx          # Flight creation/editing form
│   ├── flights-table.tsx        # Flight data table with CRUD
│   ├── weather-impact-analysis.tsx
│   ├── temporal-analysis.tsx
│   └── airline-performance-comparison.tsx
├── lib/                         # Utility functions and data access
│   ├── db.ts                   # Database connection and query functions
│   ├── data.ts                 # Data access layer with CRUD operations
│   ├── advanced-queries.ts     # Complex analytical SQL queries
│   └── types.ts                # TypeScript type definitions
└── database/                   # SQL scripts and schema
    ├── schema.sql
    └── sample-data.sql
```

## Key Features Deep Dive

### Advanced SQL Queries

1. **Weather Impact Analysis**
   - Analyzes correlation between weather events and flight delays
   - Uses spatial distance calculations and temporal joins
   - Groups results by weather type, severity, and distance categories

2. **Temporal Delay Analysis**
   - Examines delay patterns throughout the day
   - Calculates percentages for different delay types
   - Identifies peak delay hours and causes

3. **Airline Performance Comparison**
   - Compares airline performance during normal vs. weather conditions
   - Uses correlated subqueries and complex aggregations
   - Provides insights into airline resilience

### Database Optimizations

- **Indexing Strategy**: Comprehensive indexing on frequently queried columns
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized queries with proper join strategies
- **Transaction Management**: ACID compliance with appropriate isolation levels

## Advanced Database Features

### Stored Procedures
- `GetDelayedFlights`: Multi-result set procedure for comprehensive delay analysis
- Parameterized queries with default value handling
- Cursor-based operations for complex data processing

### Transactions
- `UpdateFlightStatusWithPrediction`: Updates flight status and creates predictions atomically
- REPEATABLE READ isolation level for data consistency
- Proper error handling and rollback mechanisms

### Triggers
- `after_flight_status_update`: Automatically generates delay predictions
- Event-driven architecture for real-time updates
- Conditional logic for intelligent prediction creation

## Performance Metrics

Query performance improvements with indexing:
- Weather Impact Query: 68% improvement (3842ms → 1218ms)
- Temporal Analysis: 70% improvement (1843ms → 552ms)
- Airline Performance: 67% improvement (9475ms → 3138ms)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Summary of tech stack

- **Database Design & Advanced Queries**: Complex SQL implementations and optimization
- **Frontend Development**: React components and user interface
- **Backend Integration**: API development and database connectivity
- **Analytics & Visualization**: Data analysis and chart implementations

```
