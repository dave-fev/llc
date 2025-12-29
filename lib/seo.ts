import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://swiftsfilling.com/api';

export async function getSEOMetadata(pagePath: string): Promise<Metadata> {
    try {
        // We fetch from our new Laravel backend via the API URL
        const response = await fetch(`${API_URL}/seo?pagePath=${encodeURIComponent(pagePath)}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch SEO metadata');
        }

        const data = await response.json();

        return {
            title: data.title || 'Swift Filling - Professional LLC Formation Service',
            description: data.description || 'Form your LLC fast and easy with Swift Filling.',
            keywords: data.keywords || 'LLC formation, form LLC, LLC registration',
            robots: data.robots || 'index, follow',
            openGraph: {
                title: data.ogTitle || data.title,
                description: data.ogDescription || data.description,
                images: data.ogImage ? [{ url: data.ogImage }] : undefined,
                type: 'website',
                url: data.canonicalUrl,
            },
            twitter: {
                card: (data.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
                title: data.twitterTitle || data.title,
                description: data.twitterDescription || data.description,
                images: data.twitterImage ? [data.twitterImage] : data.ogImage ? [data.ogImage] : undefined,
            },
            alternates: {
                canonical: data.canonicalUrl,
            },
        };
    } catch (error) {
        console.error('Error fetching SEO metadata:', error);

        // Return default metadata if fetch fails
        return {
            title: 'Swift Filling - Professional LLC Formation Service',
            description: 'Form your LLC fast and easy with Swift Filling. Professional LLC formation service.',
            keywords: 'LLC formation, form LLC, LLC registration',
            robots: 'index, follow',
        };
    }
}
