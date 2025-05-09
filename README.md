# CFMS Frontend

This is the frontend of the **CFMS (Category and Subcategory Management System)**, built using [Next.js](https://nextjs.org/). The project is designed to manage categories and subcategories efficiently with a modern UI and robust functionality. It provides a seamless user experience for managing data, integrating APIs, and ensuring responsiveness across devices.

---

## Features

-   **Responsive Design**:
    -   Optimized for both desktop and mobile devices.
    -   Ensures a consistent user experience across different screen sizes.
-   **Modern UI Components**:
    -   Built with reusable and accessible components.
    -   Includes dropdowns, modals, tables, and form validations.
-   **API Integration**:
    -   Seamless integration with backend services for data fetching and manipulation.
    -   Uses `react-query` for efficient state management and caching.
-   **Localization Support**:
    -   Multi-language support for a global audience.
    -   Easily extendable for additional languages.
-   **Real-Time Notifications**:
    -   Displays real-time updates and notifications for user actions.
-   **Data Validation**:
    -   Implements robust validation using `zod` schemas for form inputs and API requests.

---

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [Yarn](https://yarnpkg.com/) or npm
-   A modern web browser (e.g., Chrome, Firefox)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SP25SE153-CFMS/CFMS-Frontend
    cd cfms-frontend
    ```

2. Install dependencies:

    ```bash
    yarn install
    # or
    npm install
    ```

3. Set up environment variables:

    Copy `.env.example` to `.env` and configure the required variables:

    ```bash
    cp .env.example .env
    ```

    Example `.env` file:

    ```env
    NEXT_PUBLIC_API_URL=https://api.example.com
    NEXT_PUBLIC_ENV=development
    ```

---

## Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Building for Production

To build the project for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

---

## Folder Structure

```
src/
├── app/                # Application pages and layouts
├── components/         # Reusable UI components
├── configs/            # Configuration files
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API service functions
├── styles/             # Global and component-specific styles
├── utils/              # Helper functions and schemas
└── public/             # Static assets (images, icons, etc.)
```

---

## Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/)
-   **State Management**: [React Query](https://tanstack.com/query/v4)
-   **Validation**: [Zod](https://zod.dev/)
-   **Styling**: Tailwind CSS
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
-   **API Integration**: Axios
-   **Date Handling**: Day.js

---

## Contributing

We welcome contributions to improve this project! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add new feature"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request on GitHub.

---

## Learn More

To learn more about the tools and technologies used in this project, check out the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
-   [React Query Documentation](https://tanstack.com/query/v4/docs) - Learn about efficient state management.
-   [Zod Documentation](https://zod.dev/) - Learn about schema validation.
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about utility-first CSS.

---

## Deploy on Vercel

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com/). Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to contribute to this project by submitting issues or pull requests!
