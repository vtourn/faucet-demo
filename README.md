# faucet-demo
### Requirements
- Node.js (> v18)
- npm (> v11)

### Backend
#### Setup the faucet funding account private key
```
cd backend
cp .env.example .env
```
Update `FAUCET_PRIVATE_KEY` with your private key

#### Install dependencies
```
npm install
```

#### Start the server
```
npm run dev
```

### Fronted

#### Install dependencies
```
cd frontend
npm install
```

#### Start the dev server
```
npm run dev
```

#### Navigate to `http://localhost:5173/`

React app was created using:
`npm create vite@latest my-react-app -- --template react-ts`


