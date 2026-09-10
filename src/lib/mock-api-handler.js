export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawUrl = req.url || '';
  const urlPath = rawUrl.split('?')[0].replace(/^\/api\/v1/, '').replace(/^\/api/, '');

  // Auth me
  if (urlPath === '/auth/me') {
    return res.status(200).json({
      user: {
        id: 'mock-user-123',
        email: 'demo@kaligan.ai',
        name: 'Demo User',
        role: 'owner'
      },
      workspace: {
        id: 'mock-workspace-123',
        name: 'Kaligan Demo Workspace',
        plan: 'pro',
        isDemo: true
      }
    });
  }

  // Auth login
  if (urlPath === '/auth/login') {
    return res.status(200).json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'mock-user-123',
        email: 'demo@kaligan.ai',
        name: 'Demo User',
        role: 'owner'
      },
      workspace: {
        id: 'mock-workspace-123',
        name: 'Kaligan Demo Workspace',
        plan: 'pro',
        isDemo: true
      }
    });
  }

  // Auth refresh
  if (urlPath === '/auth/refresh') {
    return res.status(200).json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    });
  }

  // Auth signup / verify
  if (urlPath.startsWith('/auth/signup')) {
    return res.status(200).json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: 'mock-user-123',
        email: 'demo@kaligan.ai',
        name: 'Demo User',
        role: 'owner'
      },
      workspace: {
        id: 'mock-workspace-123',
        name: 'Kaligan Demo Workspace',
        plan: 'pro',
        isDemo: true
      }
    });
  }

  // Auth logout
  if (urlPath === '/auth/logout') {
    return res.status(200).json({ success: true });
  }

  // Dashboard metrics
  if (urlPath === '/dashboard/metrics') {
    return res.status(200).json({
      conversations: {
        value: '1,254',
        deltaPct: '+12.5%',
        deltaTone: 'up',
        spark: '45,52,48,61,59,70,82'
      },
      leadsCaptured: {
        value: '342',
        deltaPct: '+5.2%',
        deltaTone: 'up',
        spark: '12,15,10,18,21,25,30'
      },
      hotLeads: {
        value: '89',
        deltaPct: '-2.1%',
        deltaTone: 'flat',
        spark: '5,4,6,3,5,8,7'
      },
      opportunities: {
        value: '$12,450',
        deltaPct: '+18.4%',
        deltaTone: 'up',
        spark: '400,500,450,600,800,750,900'
      },
      needsYou: [
        {
          id: 'lead-1',
          score: 'Hot',
          name: 'John Doe',
          email: 'john@example.com',
          note: 'Requested enterprise pricing',
          time: '10 mins ago'
        },
        {
          id: 'lead-2',
          score: 'Warm',
          name: 'Sarah Smith',
          email: 'sarah@acme.com',
          note: 'Questions about integration',
          time: '2 hours ago'
        }
      ],
      recentActivity: [
        {
          id: 'act-1',
          visitor: 'visitor-8f2a',
          time: 'Just now',
          messages: 14,
          captured: true
        },
        {
          id: 'act-2',
          visitor: 'visitor-9c1b',
          time: '5 mins ago',
          messages: 3,
          captured: false
        },
        {
          id: 'act-3',
          visitor: 'visitor-4d7e',
          time: '12 mins ago',
          messages: 28,
          captured: true
        }
      ]
    });
  }

  // Agents
  if (urlPath === '/agents' || urlPath.startsWith('/agents?')) {
    return res.status(200).json([
      {
        id: 'agent-1',
        name: 'Alex',
        role: 'Sales Representative',
        kind: 'voice',
        status: 'active',
        callsHandled: 450,
        conversionRate: 12.5,
        createdAt: '2026-08-01T10:00:00Z'
      },
      {
        id: 'agent-2',
        name: 'Sarah',
        role: 'Customer Support',
        kind: 'chat',
        status: 'active',
        callsHandled: 850,
        conversionRate: 8.2,
        createdAt: '2026-08-15T10:00:00Z'
      }
    ]);
  }

  if (urlPath.startsWith('/agents/')) {
    return res.status(200).json({
      id: 'agent-1',
      name: 'Alex',
      role: 'Sales Representative',
      kind: 'voice',
      status: 'active',
      callsHandled: 450,
      conversionRate: 12.5,
      createdAt: '2026-08-01T10:00:00Z'
    });
  }

  // Conversations
  if (urlPath === '/conversations' || urlPath.startsWith('/conversations?')) {
    return res.status(200).json([
      {
        id: 'conv-1',
        agentId: 'agent-1',
        leadName: 'John Doe',
        status: 'completed',
        durationSec: 124,
        sentiment: 'positive',
        createdAt: '2026-09-10T13:40:03.932Z'
      },
      {
        id: 'conv-2',
        agentId: 'agent-2',
        leadName: 'Jane Smith',
        status: 'in-progress',
        durationSec: 45,
        sentiment: 'neutral',
        createdAt: '2026-09-10T13:40:03.932Z'
      }
    ]);
  }

  if (urlPath.startsWith('/conversations/')) {
    return res.status(200).json({
      id: 'conv-1',
      agentId: 'agent-1',
      leadName: 'John Doe',
      status: 'completed',
      durationSec: 124,
      sentiment: 'positive',
      messages: [
        { id: 'm1', sender: 'visitor', text: 'Hi, I need pricing information for enterprise plan.', time: '10 mins ago' },
        { id: 'm2', sender: 'agent', text: 'Hello! I would be happy to assist you with our enterprise tier. How many seats are you looking to support?', time: '10 mins ago' },
        { id: 'm3', sender: 'visitor', text: 'Around 500 seats across 3 continents.', time: '9 mins ago' }
      ],
      createdAt: '2026-09-10T13:40:03.932Z'
    });
  }

  // Leads
  if (urlPath === '/leads' || urlPath.startsWith('/leads?')) {
    return res.status(200).json([
      {
        id: 'lead-1',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '+1234567890',
        status: 'new',
        score: 85,
        createdAt: '2026-09-10T13:40:04.218Z'
      },
      {
        id: 'lead-2',
        name: 'Global Tech',
        email: 'hello@globaltech.io',
        phone: '+0987654321',
        status: 'contacted',
        score: 92,
        createdAt: '2026-09-10T13:40:04.218Z'
      }
    ]);
  }

  if (urlPath.startsWith('/leads/')) {
    return res.status(200).json({
      id: 'lead-1',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '+1234567890',
      status: 'new',
      score: 85,
      notes: 'Requested enterprise pricing',
      createdAt: '2026-09-10T13:40:04.218Z'
    });
  }

  // Knowledge base
  if (urlPath === '/kb/documents') {
    return res.status(200).json([
      {
        id: 'doc-1',
        type: 'pdf',
        name: 'Employee Handbook.pdf',
        status: 'ready',
        chunkCount: 45,
        pct: 100,
        updatedAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'doc-2',
        type: 'url',
        name: 'https://example.com/pricing',
        status: 'ready',
        chunkCount: 12,
        pct: 100,
        updatedAt: '2026-09-02T12:00:00Z'
      }
    ]);
  }

  if (urlPath === '/kb/status') {
    return res.status(200).json({
      sources: 2,
      ready: 2,
      topicsApprox: 15,
      lastTrainedAt: '2026-09-02T12:05:00Z'
    });
  }

  // Telephony numbers
  if (urlPath === '/telephony/numbers') {
    return res.status(200).json([
      {
        id: 'num-1',
        e164: '+14155551234',
        friendlyName: 'Main Sales Line',
        status: 'active',
        agent: {
          name: 'Alex',
          role: 'Sales Rep'
        }
      },
      {
        id: 'num-2',
        e164: '+14155559876',
        friendlyName: 'Customer Support',
        status: 'active',
        agent: {
          name: 'Sarah',
          role: 'Support Agent'
        }
      }
    ]);
  }

  // Integrations
  if (urlPath === '/integrations') {
    return res.status(200).json({ integrations: [] });
  }

  // Telephony calls & campaigns
  if (urlPath.startsWith('/telephony/calls')) {
    return res.status(200).json([]);
  }

  if (urlPath.startsWith('/telephony/outbound')) {
    return res.status(200).json([]);
  }

  // Analytics
  if (urlPath.startsWith('/analytics')) {
    return res.status(200).json({ data: [] });
  }

  // Billing
  if (urlPath.startsWith('/billing')) {
    return res.status(200).json({ usage: [] });
  }

  return res.status(200).json({ success: true });
}
