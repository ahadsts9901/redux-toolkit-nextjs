import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';

export default function MyApp(props) {
    return (
        <AppCacheProvider {...props}>
        </AppCacheProvider>
    );
}
