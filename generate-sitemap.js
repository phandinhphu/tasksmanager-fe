import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const links = [];

// Danh sách các route chính của app (có thể bổ sung thêm nếu cần)
links.push(
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/login', changefreq: 'monthly', priority: 0.5 },
    { url: '/register', changefreq: 'monthly', priority: 0.5 },
    { url: '/about', changefreq: 'monthly', priority: 0.4 },
    { url: '/help', changefreq: 'monthly', priority: 0.4 },
    { url: '/profile', changefreq: 'weekly', priority: 0.7 },
    { url: '/account-setting', changefreq: 'monthly', priority: 0.4 },
    { url: '/tasks', changefreq: 'daily', priority: 0.9 },
    { url: '/add-task', changefreq: 'weekly', priority: 0.7 },
    { url: '/tasks-overdue', changefreq: 'daily', priority: 0.8 },
    { url: '/tasks-completed', changefreq: 'daily', priority: 0.8 },
    { url: '/todos', changefreq: 'daily', priority: 0.8 },
    { url: '/schedules', changefreq: 'weekly', priority: 0.7 },
    { url: '/add-schedule', changefreq: 'weekly', priority: 0.6 },
    { url: '/forgot-password', changefreq: 'monthly', priority: 0.3 },
    { url: '/reset-password', changefreq: 'monthly', priority: 0.3 },
    { url: '/verify-success', changefreq: 'monthly', priority: 0.3 },
);

// Tạo sitemap và ghi ra file public/sitemap.xml
const stream = new SitemapStream({ hostname: 'https://tasksmanager-fe.vercel.app/' }); // Đổi hostname cho phù hợp

streamToPromise(Readable.from(links).pipe(stream))
    .then((data) => {
        createWriteStream('./public/sitemap.xml').write(data.toString());
        console.log('Sitemap generated successfully!');
    })
    .catch((err) => {
        console.error('Error generating sitemap:', err);
    });
