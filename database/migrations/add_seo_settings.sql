-- Add SEO Settings Table
USE swift_filling;

CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_path VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  keywords VARCHAR(500),
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  canonical_url VARCHAR(500),
  robots VARCHAR(100) DEFAULT 'index, follow',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page_path (page_path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default SEO settings for main pages
INSERT INTO seo_settings (page_path, title, description, keywords, robots) VALUES
('/', 'Form Your LLC Fast & Easy | Swift Filling - Professional LLC Formation Service', 'Start your business with confidence. Professional LLC formation service trusted by thousands. Fast, secure, and affordable. Form your LLC in all 50 states with expert guidance.', 'LLC formation, form LLC, LLC registration, business formation, start LLC, LLC service, limited liability company', 'index, follow'),
('/about', 'About Swift Filling - Your Trusted LLC Formation Partner', 'Learn about Swift Filling, your trusted partner in business formation. Over 10 years of experience helping entrepreneurs form LLCs across all 50 states.', 'about Swift Filling, LLC formation company, business formation service', 'index, follow'),
('/contact', 'Contact Swift Filling - Get Expert LLC Formation Help', 'Contact our expert team for help with your LLC formation. We''re here to answer your questions and guide you through the process.', 'contact Swift Filling, LLC formation help, business formation support', 'index, follow'),
('/form', 'Start Your LLC Formation - Swift Filling Online Application', 'Begin your LLC formation process with our easy online application. Step-by-step guidance for forming your LLC in any state.', 'form LLC, start LLC formation, LLC application, register LLC', 'index, follow'),
('/login', 'Login to Your Account - Swift Filling', 'Login to your Swift Filling account to track your LLC formation, view documents, and manage your business.', 'login, account login, Swift Filling login', 'noindex, follow'),
('/user', 'User Dashboard - Swift Filling', 'Manage your LLC formation orders, view documents, and track your business formation progress.', 'user dashboard, account dashboard', 'noindex, follow')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;




