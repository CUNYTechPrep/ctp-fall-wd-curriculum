export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Week 9 Demo: Blog Platform
          </h1>
          <p className="text-xl text-gray-600">
            PostgreSQL + Drizzle ORM + Next.js
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              User authentication with AWS Cognito
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              User preferences in DynamoDB
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Blog posts stored in PostgreSQL
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Comments with relationships
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Type-safe database operations with Drizzle ORM
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">API Endpoints</h3>
            <ul className="space-y-2 text-sm">
              <li><code className="bg-white px-2 py-1 rounded">GET /api/posts</code></li>
              <li><code className="bg-white px-2 py-1 rounded">GET /api/posts/[id]</code></li>
              <li><code className="bg-white px-2 py-1 rounded">POST /api/posts</code></li>
              <li><code className="bg-white px-2 py-1 rounded">PUT /api/posts/[id]</code></li>
              <li><code className="bg-white px-2 py-1 rounded">DELETE /api/posts/[id]</code></li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Quick Start</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Run <code className="bg-white px-2 py-1 rounded">docker-compose up -d</code></li>
              <li>Run <code className="bg-white px-2 py-1 rounded">npm run setup:local</code></li>
              <li>Run <code className="bg-white px-2 py-1 rounded">npm run db:seed</code></li>
              <li>Visit <code className="bg-white px-2 py-1 rounded">/api/posts</code></li>
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/api/posts"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Posts API →
          </a>
        </div>
      </div>
    </main>
  );
}
