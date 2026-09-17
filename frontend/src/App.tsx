import { AppRouter } from './router';
import { AuthProvider } from './context/AuthContext';
import { ActionProvider } from './context/ActionContext';

export function App() {
  return (
    <AuthProvider>
      <ActionProvider>
        <AppRouter />
      </ActionProvider>
    </AuthProvider>
  );
}

export default App;
