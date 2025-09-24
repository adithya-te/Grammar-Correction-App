#!/bin/bash

# Grammar Correction App Setup Script
# This script automates the setup process for the grammar correction application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | sed 's/v//')
        REQUIRED_VERSION="16.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION or higher"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to install dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed"
}

install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
}

# Function to setup environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from example"
    else
        print_warning "backend/.env already exists, skipping"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001/api
EOF
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists, skipping"
    fi
}

# Function to setup Tailwind CSS
setup_tailwind() {
    print_status "Setting up Tailwind CSS..."
    cd frontend
    
    if [ ! -f "tailwind.config.js" ]; then
        npx tailwindcss init -p
        print_success "Initialized Tailwind CSS"
    else
        print_warning "Tailwind config already exists, skipping"
    fi
    
    cd ..
}

# Function to create necessary directories
create_directories() {
    print_status "Creating project directories..."
    
    mkdir -p backend/src/{controllers,services,middleware,routes}
    mkdir -p frontend/src/{components,services,utils}
    mkdir -p docker
    
    print_success "Project directories created"
}

# Function to test the setup
test_setup() {
    print_status "Testing the setup..."
    
    # Test backend
    print_status "Starting backend server for testing..."
    cd backend
    timeout 10s npm start &
    BACKEND_PID=$!
    sleep 5
    
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        print_success "Backend server is responding"
        kill $BACKEND_PID 2>/dev/null || true
    else
        print_warning "Backend server test failed (this might be normal if LanguageTool is not running)"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    cd ..
}

# Function to display setup completion message
show_completion_message() {
    echo
    print_success "🎉 Setup completed successfully!"
    echo
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Start the backend server:"
    echo "   cd backend && npm run dev"
    echo
    echo "2. Start the frontend server (in a new terminal):"
    echo "   cd frontend && npm start"
    echo
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo
    echo -e "${BLUE}Optional - Self-hosted LanguageTool:${NC}"
    echo "   docker-compose up -d"
    echo
    echo -e "${BLUE}Documentation:${NC}"
    echo "   Read README.md for detailed instructions"
    echo
}

# Function to display help
show_help() {
    echo "Grammar Correction App Setup Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --skip-test Skip the setup testing phase"
    echo "  -d, --docker   Also setup Docker environment"
    echo "  --clean        Clean previous installation"
    echo
    echo "This script will:"
    echo "  1. Check system requirements"
    echo "  2. Install dependencies"
    echo "  3. Setup environment files"
    echo "  4. Configure the application"
    echo "  5. Test the setup (optional)"
    echo
}

# Function to clean previous installation
clean_installation() {
    print_status "Cleaning previous installation..."
    
    # Remove node_modules
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    
    # Remove environment files
    rm -f backend/.env
    rm -f frontend/.env
    
    # Remove build directories
    rm -rf frontend/build
    
    print_success "Previous installation cleaned"
}

# Main setup function
main_setup() {
    echo "🚀 Grammar Correction App Setup"
    echo "================================="
    echo
    
    # Check system requirements
    print_status "Checking system requirements..."
    
    if ! check_node_version; then
        print_error "Please install Node.js 16+ and try again"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "System requirements satisfied"
    echo
    
    # Create directories
    create_directories
    
    # Setup environment files
    setup_env_files
    
    # Install dependencies
    install_backend_deps
    install_frontend_deps
    
    # Setup Tailwind (if needed)
    setup_tailwind
    
    # Test setup (if not skipped)
    if [ "$SKIP_TEST" != "true" ]; then
        test_setup
    fi
    
    # Show completion message
    show_completion_message
}

# Parse command line arguments
SKIP_TEST=false
SETUP_DOCKER=false
CLEAN_INSTALL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--skip-test)
            SKIP_TEST=true
            shift
            ;;
        -d|--docker)
            SETUP_DOCKER=true
            shift
            ;;
        --clean)
            CLEAN_INSTALL=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Clean installation if requested
if [ "$CLEAN_INSTALL" = "true" ]; then
    clean_installation
    echo
fi

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "This script must be run from the project root directory"
    print_error "Make sure you're in the grammar-correction-app directory"
    exit 1
fi

# Run main setup
main_setup

# Setup Docker if requested
if [ "$SETUP_DOCKER" = "true" ]; then
    if command_exists docker && command_exists docker-compose; then
        print_status "Setting up Docker environment..."
        docker-compose pull
        print_success "Docker environment ready"
        echo "Run 'docker-compose up -d' to start all services"
    else
        print_warning "Docker or Docker Compose not found, skipping Docker setup"
    fi
fi