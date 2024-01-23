import {
    DocumentHeadTags,
    documentGetInitialProps,
} from '@mui/material-nextjs/v13-pagesRouter';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter';
import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument(props) {
    return (
        <AppCacheProvider {...props}>
            <Html lang="en">
                <Head>
                    <DocumentHeadTags {...props} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        </AppCacheProvider>
    );
}

MyDocument.getInitialProps = async (ctx) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};
