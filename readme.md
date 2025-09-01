//-- Front-end Structure --//

redux-book-store-main/ # Root project folder
├── public/ # Static files served publicly
│ ├── 404.html
│ ├── \_redirects
│ └── index.html

├── .firebase/ # Firebase deployment cache
│ └── hosting.ZGlzdA.cache

├── src/ # Source code
│ ├── api/ # API utility functions
│ │ └── booksApi.ts

│ ├── assets/ # Static assets like logos
│ │ ├── react.svg
│ │ └── vite.png

│ ├── components/ # Reusable UI components
│ │ ├── Banner/
│ │ ├── Benefites/
│ │ ├── CorporateClient/
│ │ ├── CountOurNumbers/
│ │ ├── Facilities/
│ │ ├── HomeBook/
│ │ ├── Strength/
│ │ └── books/ # Book-related components
│ │ ├── AddNewBook.tsx
│ │ ├── BookCard.tsx
│ │ ├── BookDetails.tsx
│ │ ├── BookList.tsx
│ │ ├── EditBook.tsx
│ │ ├── FilterOptions.tsx
│ │ ├── ReviewForm.tsx
│ │ ├── SearchBar.tsx
│ │ └── wishlist.tsx

│ ├── CustomLink/ # Custom navigation link
│ │ └── CustomLink.tsx

│ ├── Images/ # Image assets
│ │ ├── banner.jpg
│ │ ├── loginImage.png
│ │ └── companies/ # Company logos

│ ├── layouts/ # App-wide layout components
│ │ ├── Footer.tsx
│ │ ├── MainLayout.tsx
│ │ └── Navbar.tsx

│ ├── pages/ # Route-based pages
│ │ ├── Home.tsx
│ │ ├── Login.tsx
│ │ └── Register.tsx

│ ├── redux/ # Redux state management
│ │ ├── hook.ts
│ │ ├── store.ts
│ │ └── features/ # Feature slices
│ │ ├── books/booksSlice.ts
│ │ ├── users/userSlice.ts
│ │ └── wishlist/wishlistSlice.ts

│ ├── routes/ # Routing logic
│ │ ├── PrivateRoute.tsx
│ │ └── routes.tsx

│ ├── shared/ # Shared widgets and UI
│ │ ├── Loading/Loading.tsx
│ │ ├── Social/Social.tsx
│ │ └── Toast.tsx

│ ├── types/ # TypeScript interfaces/types
│ │ └── bookTypes.ts

│ ├── utils/ # Utility functions
│ │ ├── api.ts
│ │ ├── dateUtils.ts
│ │ └── firebase.ts

│ ├── App.tsx # Main App component
│ ├── main.tsx # App entry point
│ ├── App.css
│ ├── index.css
│ └── vite-env.d.ts

├── .eslintrc.cjs # Linter configuration
├── .firebaserc # Firebase config
├── .gitignore
├── .prettierrc.json # Code formatter config
├── firebase.json # Firebase settings
├── index.html # Main HTML file
├── package.json # NPM dependencies
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json # TypeScript config
├── tsconfig.node.json
├── vite.config.ts # Vite bundler config
└── README.MD
