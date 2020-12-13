import dotenv from 'dotenv';
dotenv.config({path: '.env'});

console.log(process.env.SANITY_TOKEN);

export default {
    siteMetadata: {
        title: `Slicks Slices`,
        siteUrl: 'http://gatsby.pizza',
        description: 'The best pizza place in hamilton',
        twitter: '@slicksSlices',

    },

    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-source-sanity',
            options: {
                projectId: 'llq32lg3',
                dataset: 'production',
                watchmode: true,
                token: process.env.SANITY_TOKEN,
            }
        }
    ]
}

