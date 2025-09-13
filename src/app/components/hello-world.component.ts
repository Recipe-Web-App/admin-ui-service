import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  template: `
    <div class="hello-container">
      <div class="hello-content">
        <h1>Hello World!</h1>
        <p>Welcome to the Admin UI Service</p>
        <div class="status-badge">✅ App infrastructure is working correctly</div>
      </div>
    </div>
  `,
  styles: [
    `
      .hello-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .hello-content {
        text-align: center;
        background: white;
        padding: 3rem;
        border-radius: 1rem;
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
        max-width: 500px;
      }

      h1 {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 1rem 0;
      }

      p {
        font-size: 1.25rem;
        color: #6b7280;
        margin: 0 0 2rem 0;
      }

      .status-badge {
        display: inline-block;
        background: #10b981;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        font-weight: 600;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class HelloWorldComponent {}
