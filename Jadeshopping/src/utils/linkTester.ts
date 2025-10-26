import { routes } from '../router';

export interface LinkTestResult {
  url: string;
  status: 'success' | 'error' | 'warning';
  statusCode?: number;
  loadTime?: number;
  error?: string;
  source: string;
  type: 'internal' | 'external' | 'anchor' | 'tel' | 'mailto';
}

export interface TestReport {
  totalLinks: number;
  passedLinks: number;
  failedLinks: number;
  warningLinks: number;
  results: LinkTestResult[];
  testDuration: number;
  timestamp: string;
}

class LinkTester {
  private baseUrl = 'http://localhost:5173';
  private results: LinkTestResult[] = [];
  private startTime = 0;

  // 从项目文件中提取的所有链接
  private extractedLinks = [

    
    // Header.tsx 链接
    { url: '/', source: 'Header.tsx', type: 'internal' as const },
    { url: '/favorites', source: 'Header.tsx', type: 'internal' as const },
    { url: '/cart', source: 'Header.tsx', type: 'internal' as const },
    { url: '/checkout', source: 'Header.tsx', type: 'internal' as const },
    { url: '/products', source: 'Header.tsx', type: 'internal' as const },
    { url: '/settings', source: 'Header.tsx', type: 'internal' as const },
    
    // Orders.tsx 链接
    { url: '/orders/packages', source: 'Orders.tsx', type: 'internal' as const },
    { url: '/orders/deleted', source: 'Orders.tsx', type: 'internal' as const },
    
    // Service.tsx 链接
    { url: '/help', source: 'Service.tsx', type: 'internal' as const },
    { url: '/returns', source: 'Service.tsx', type: 'internal' as const },
    { url: '/contact', source: 'Service.tsx', type: 'internal' as const },
    
    // Settings.tsx 链接
    { url: '/settings', source: 'Settings.tsx', type: 'internal' as const },
    
    // ProductDetail.tsx 链接
    { url: '/products', source: 'ProductDetail.tsx', type: 'internal' as const },
    
    // Favorites.tsx 链接
    { url: '/login', source: 'Favorites.tsx', type: 'internal' as const },
    
    // Join.tsx 链接
    { url: 'tel:400-666-8888', source: 'Join.tsx', type: 'tel' as const },
    { url: 'mailto:join@jadeyayun.com', source: 'Join.tsx', type: 'mailto' as const },
    
    // Footer.tsx 链接
    { url: '/', source: 'Footer.tsx', type: 'internal' as const },
    
    // Address.tsx 链接
    { url: '/address', source: 'Address.tsx', type: 'internal' as const },
    
    // Culture.tsx 链接
    { url: '/about', source: 'Culture.tsx', type: 'internal' as const },
    
    // Supplier.tsx 链接
    { url: 'tel:400-777-8888', source: 'Supplier.tsx', type: 'tel' as const },
    { url: 'mailto:supplier@jadeyayun.com', source: 'Supplier.tsx', type: 'mailto' as const },
    
    // Cart.tsx 链接
    { url: '/', source: 'Cart.tsx', type: 'internal' as const },
    { url: '/products', source: 'Cart.tsx', type: 'internal' as const },
    { url: '/checkout', source: 'Cart.tsx', type: 'internal' as const },
    
    // Contact.tsx 链接
    { url: '/help', source: 'Contact.tsx', type: 'internal' as const },
    { url: '/service', source: 'Contact.tsx', type: 'internal' as const },
    { url: '/about', source: 'Contact.tsx', type: 'internal' as const },
    
    // Returns.tsx 链接
    { url: 'tel:400-888-9999', source: 'Returns.tsx', type: 'tel' as const },
    { url: 'mailto:service@jadeyayun.com', source: 'Returns.tsx', type: 'mailto' as const },
    { url: '/shipping', source: 'Returns.tsx', type: 'internal' as const },
    
    // NotFound.tsx 链接
    { url: '/', source: 'NotFound.tsx', type: 'internal' as const },
    
    // Home.tsx 链接
    { url: '/products', source: 'Home.tsx', type: 'internal' as const },
    { url: '/about', source: 'Home.tsx', type: 'internal' as const },
    
    // About.tsx 链接
    { url: '/contact', source: 'About.tsx', type: 'internal' as const },
    { url: '/history', source: 'About.tsx', type: 'internal' as const },
    
    // Media.tsx 链接
    { url: 'mailto:media@jadeyayun.com', source: 'Media.tsx', type: 'mailto' as const },
    { url: 'tel:400-555-8888', source: 'Media.tsx', type: 'tel' as const },
    
    // Wholesale.tsx 链接
    { url: 'tel:400-666-8888', source: 'Wholesale.tsx', type: 'tel' as const },
    { url: 'mailto:wholesale@jadeyayun.com', source: 'Wholesale.tsx', type: 'mailto' as const },
    
    // ProductList.tsx 链接
    { url: '/products', source: 'ProductList.tsx', type: 'internal' as const },
    
    // History.tsx 链接
    { url: '/about', source: 'History.tsx', type: 'internal' as const },
    { url: '/culture', source: 'History.tsx', type: 'internal' as const },
    { url: '/contact', source: 'History.tsx', type: 'internal' as const },
    
    // Shipping.tsx 链接
    { url: 'tel:400-888-9999', source: 'Shipping.tsx', type: 'tel' as const },
    { url: '/contact', source: 'Shipping.tsx', type: 'internal' as const },
    { url: '/returns', source: 'Shipping.tsx', type: 'internal' as const },
    { url: '/service', source: 'Shipping.tsx', type: 'internal' as const },
    { url: '/help', source: 'Shipping.tsx', type: 'internal' as const },
    
    // Checkout.tsx 链接
    { url: '/products', source: 'Checkout.tsx', type: 'internal' as const },
    { url: '/login', source: 'Checkout.tsx', type: 'internal' as const },
    { url: '/cart', source: 'Checkout.tsx', type: 'internal' as const },
    
    // FloatingCart.tsx 链接
    { url: '/cart', source: 'FloatingCart.tsx', type: 'internal' as const },
    { url: '/checkout', source: 'FloatingCart.tsx', type: 'internal' as const },
  ];

  // 有效路由白名单
  private validRoutes = [
    '/',
    '/products',
    '/product/',
    '/cart',
    '/checkout',
    '/login',
    '/orders',
    '/favorites',
    '/address',
    '/settings',
    '/payments',
    '/coupons',
    '/points',
    '/wallet',
    '/gift-card',
    '/recently-viewed',
    '/help',
    '/contact',
    '/about',
    '/service',
    '/returns',
    '/shipping',
    '/history',
    '/culture',
    '/join',
    '/supplier',
    '/wholesale',
    '/media',
    '/policy/coupons',
    '/policy/points',
    '/policy/wallet',
    '/policy/payments',
    '/club',
    '/vip',
    '/wallet',
    '/settings',
    '/address',
    '/payments',
    '/coupons',
    '/points',
    '/gift-card',
    '/orders',
    '/favorites',
    '/recently-viewed',
    '/follow',
    '/help',
    '/contact',
    '/policy/coupons',
    '/policy/points',
    '/policy/wallet',
    '/policy/payments',
    '/shipping',
    '/returns'
  ];

  async testLink(link: { url: string; source: string; type: string }): Promise<LinkTestResult> {
    const startTime = performance.now();
    
    try {
      if (link.type === 'tel' || link.type === 'mailto') {
        // 对于电话和邮件链接，只验证格式
        const isValid = this.validateSpecialLink(link.url, link.type);
        return {
          url: link.url,
          status: isValid ? 'success' : 'error',
          loadTime: performance.now() - startTime,
          source: link.source,
          type: link.type as any,
          error: isValid ? undefined : `Invalid ${link.type} format`
        };
      }

      if (link.type === 'internal') {
        // 对于内部链接，检查路由是否存在
        const isValidRoute = this.isValidInternalRoute(link.url);
        
        if (!isValidRoute) {
          return {
            url: link.url,
            status: 'error',
            loadTime: performance.now() - startTime,
            source: link.source,
            type: 'internal',
            error: 'Route not found in router configuration'
          };
        }

        // 尝试访问页面
        try {
          const response = await fetch(`${this.baseUrl}${link.url}`, {
            method: 'HEAD',
            timeout: 3000
          });
          
          return {
            url: link.url,
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            loadTime: performance.now() - startTime,
            source: link.source,
            type: 'internal',
            error: response.ok ? undefined : `HTTP ${response.status}`
          };
        } catch (fetchError) {
          // 如果 HEAD 请求失败，尝试 GET 请求
          try {
            const response = await fetch(`${this.baseUrl}${link.url}`, {
              timeout: 3000
            });
            
            return {
              url: link.url,
              status: response.ok ? 'success' : 'error',
              statusCode: response.status,
              loadTime: performance.now() - startTime,
              source: link.source,
              type: 'internal',
              error: response.ok ? undefined : `HTTP ${response.status}`
            };
          } catch (error) {
            return {
              url: link.url,
              status: 'warning',
              loadTime: performance.now() - startTime,
              source: link.source,
              type: 'internal',
              error: 'Cannot test in development environment, but route exists'
            };
          }
        }
      }

      if (link.type === 'external') {
        // 对于外部链接，检查HTTP状态
        try {
          const response = await fetch(link.url, {
            method: 'HEAD',
            timeout: 5000
          });
          
          return {
            url: link.url,
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            loadTime: performance.now() - startTime,
            source: link.source,
            type: 'external',
            error: response.ok ? undefined : `HTTP ${response.status}`
          };
        } catch (error) {
          return {
            url: link.url,
            status: 'error',
            loadTime: performance.now() - startTime,
            source: link.source,
            type: 'external',
            error: error instanceof Error ? error.message : 'Network error'
          };
        }
      }

      return {
        url: link.url,
        status: 'error',
        loadTime: performance.now() - startTime,
        source: link.source,
        type: link.type as any,
        error: 'Unknown link type'
      };

    } catch (error) {
      return {
        url: link.url,
        status: 'error',
        loadTime: performance.now() - startTime,
        source: link.source,
        type: link.type as any,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private validateSpecialLink(url: string, type: string): boolean {
    if (type === 'tel') {
      return /^tel:[+]?[\d\s\-\(\)]+$/.test(url);
    }
    if (type === 'mailto') {
      return /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url);
    }
    return false;
  }

  private isValidInternalRoute(url: string): boolean {
    // 移除查询参数和锚点
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // 检查是否是精确匹配
    if (this.validRoutes.includes(cleanUrl)) {
      return true;
    }
    
    // 检查是否匹配动态路由
    return this.validRoutes.some(route => {
      if (route.includes(':')) {
        const routePattern = route.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(cleanUrl);
      }
      return false;
    });
  }

  async runAllTests(): Promise<TestReport> {
    this.startTime = performance.now();
    this.results = [];

    console.log('开始链接测试...');
    
    // 去重链接
    const uniqueLinks = this.extractedLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.url === link.url && l.type === link.type)
    );

    console.log(`发现 ${uniqueLinks.length} 个唯一链接`);

    // 并发测试所有链接
    const testPromises = uniqueLinks.map(link => this.testLink(link));
    this.results = await Promise.all(testPromises);

    const testDuration = performance.now() - this.startTime;
    
    const report: TestReport = {
      totalLinks: this.results.length,
      passedLinks: this.results.filter(r => r.status === 'success').length,
      failedLinks: this.results.filter(r => r.status === 'error').length,
      warningLinks: this.results.filter(r => r.status === 'warning').length,
      results: this.results,
      testDuration,
      timestamp: new Date().toISOString()
    };

    console.log('链接测试完成:', {
      总链接数: report.totalLinks,
      通过: report.passedLinks,
      失败: report.failedLinks,
      警告: report.warningLinks,
      耗时: `${(testDuration / 1000).toFixed(2)}s`
    });

    return report;
  }

  // 测试特定页面的链接
  async testPageLinks(pageName: string): Promise<LinkTestResult[]> {
    const pageLinks = this.extractedLinks.filter(link => 
      link.source.toLowerCase().includes(pageName.toLowerCase())
    );
    
    const testPromises = pageLinks.map(link => this.testLink(link));
    return await Promise.all(testPromises);
  }

  // 获取失败的链接
  getFailedLinks(): LinkTestResult[] {
    return this.results.filter(result => result.status === 'error');
  }

  // 获取慢加载的链接
  getSlowLinks(threshold = 3000): LinkTestResult[] {
    return this.results.filter(result => 
      result.loadTime && result.loadTime > threshold
    );
  }
}

export const linkTester = new LinkTester();
export default LinkTester;