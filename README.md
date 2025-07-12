# Todo Board Application

A modern, feature-rich todo board application built with React, TypeScript, and Vite. This application provides an intuitive drag-and-drop interface for managing tasks across different columns (Todo, In Progress, Done).

## 🚀 Features

- **Drag & Drop**: Seamless task and column reordering using @atlaskit/pragmatic-drag-and-drop
- **Task Management**: Create, edit, delete, and organize tasks
- **Column Management**: Add, rename, and organize columns
- **Bulk Operations**: Select and manage multiple tasks at once
- **Local Storage**: Automatic data persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Efficient task management with keyboard navigation
- **Search & Filter**: Find tasks quickly with built-in search functionality

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## 🛠️ Installation & Setup

1. **Clone or download** this repository to your local machine

2. **Navigate** to the project directory:
   ```bash
   cd test_task_recman
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

### Development Mode
Start the development server with hot reloading:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Linting
Check code quality and style:
```bash
npm run lint
```

## 🏗️ Project Structure

This project follows a **feature-based architecture** for better maintainability and scalability:

```
src/
├── app/                          # Application-level configuration
│   └── TodoContext.tsx          # Global state management with React Context
├── features/                     # Feature modules (business logic)
│   ├── board/                   # Board management feature
│   │   ├── components/          # Board components
│   │   ├── hooks/               # Board-specific hooks
│   │   ├── types/               # Board type definitions
│   │   └── utils/               # Board utility functions
│   ├── column/                  # Column management feature
│   │   ├── components/          # Column components
│   │   ├── hooks/               # Column-specific hooks
│   │   ├── types/               # Column type definitions
│   │   └── utils/               # Column utility functions
│   └── task/                    # Task management feature
│       ├── components/          # Task components
│       ├── hooks/               # Task-specific hooks
│       ├── types/               # Task type definitions
│       └── utils/               # Task utility functions
├── shared/                      # Shared utilities and components
│   ├── components/              # Reusable UI components
│   │   └── ui/                 # Generic UI components (Button, Input, Dropdown)
│   ├── hooks/                  # Reusable hooks
│   │   ├── core/               # Core utility hooks
│   │   └── ui/                 # UI interaction hooks
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Utility functions
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🧩 Key Components

### Board
The main container that manages the overall layout and coordinates between columns.

### Column
Individual columns that contain tasks. Supports:
- Adding new tasks
- Drag and drop reordering
- Column title editing

### Task
Individual task items with features like:
- Content editing
- Priority levels
- Drag and drop functionality
- Bulk selection

### Shared Components
- **Button**: Standardized button component with multiple variants
- **Input**: Enhanced input component with validation
- **Dropdown**: Multi-select dropdown for task operations

## 🔧 Technologies Used

- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety and better development experience
- **Vite 7.0.4** - Fast build tool and development server
- **@atlaskit/pragmatic-drag-and-drop** - Modern drag and drop implementation
- **Lucide React** - Beautiful, customizable icons
- **ESLint** - Code linting and quality checks

## 💾 Data Persistence

The application uses browser localStorage to automatically save:
- Task data (content, status, priority)
- Column configuration
- Board layout and organization

Data persists across browser sessions without requiring a backend server.

## ⌨️ Keyboard Shortcuts

- **Enter** - Save task when editing
- **Escape** - Cancel editing
- **Delete** - Remove selected tasks
- **Ctrl/Cmd + A** - Select all tasks in a column

## 🎨 Styling

The application uses CSS modules and custom CSS for styling:
- Responsive design that works on all screen sizes
- Modern, clean interface
- Smooth animations and transitions
- Consistent color scheme and typography

## 🧪 Development

### Project Philosophy
This codebase emphasizes:
- **Feature-based organization** - Each feature is self-contained
- **Separation of concerns** - Clear boundaries between business logic and UI
- **Type safety** - Comprehensive TypeScript usage
- **Reusability** - Shared components and hooks
- **Maintainability** - Clear code structure and documentation

### Adding New Features
1. Create a new feature folder under `src/features/`
2. Follow the established pattern: components, hooks, types, utils
3. Export public APIs through index.ts files
4. Use shared components and hooks where appropriate

### Code Quality
- Follow TypeScript best practices
- Use ESLint for code quality
- Maintain consistent file and folder naming
- Document complex business logic

## 🤝 Contributing

1. Follow the established architecture patterns
2. Maintain type safety with TypeScript
3. Use the shared component library
4. Test functionality thoroughly
5. Run linting before submitting changes

## 📄 License

This project is private and not licensed for public use.