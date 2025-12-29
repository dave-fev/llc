<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SEOSettings;
use Illuminate\Http\Request;

class SEOController extends Controller
{
    public function show(Request $request)
    {
        $pagePath = $request->query('pagePath', '/');
        
        $seo = SEOSettings::where('page_path', $pagePath)->first();

        if (!$seo) {
            return response()->json([
                'title' => 'Swift Filling - Professional LLC Formation Service',
                'description' => 'Form your LLC fast and easy with Swift Filling. Professional LLC formation service trusted by thousands of businesses.',
                'keywords' => 'LLC formation, form LLC, LLC registration',
                'robots' => 'index, follow'
            ]);
        }

        return response()->json([
            'title' => $seo->title,
            'description' => $seo->description,
            'keywords' => $seo->keywords,
            'ogTitle' => $seo->og_title ?: $seo->title,
            'ogDescription' => $seo->og_description ?: $seo->description,
            'ogImage' => $seo->og_image,
            'twitterCard' => $seo->twitter_card ?: 'summary_large_image',
            'twitterTitle' => $seo->twitter_title ?: $seo->title,
            'twitterDescription' => $seo->twitter_description ?: $seo->description,
            'twitterImage' => $seo->twitter_image ?: $seo->og_image,
            'canonicalUrl' => $seo->canonical_url,
            'robots' => $seo->robots ?: 'index, follow'
        ]);
    }
}
