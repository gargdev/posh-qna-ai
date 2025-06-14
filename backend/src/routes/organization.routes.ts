// import { Router, Request, Response } from 'express';

// import { ensureAdminAuthenticated } from '../middleware/auth.middleware';
// import { Organization } from '../models/Organization';

// const router = Router();

// console.log('🔗 Setting up organization routes...');

// // Create an organization
// router.post('/create', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
//   const { name, domains } = req.body;
//   console.log(`📝 Creating organization: ${name} with domains: ${domains}`);

//   // Validate input
//   if (!name || !domains || !Array.isArray(domains) || domains.length === 0) {
//     console.error('❌ Invalid input for organization creation');
//     res.status(400).json({ error: 'Name and at least one domain are required' });
//     return;
//   }

//   // Validate domains (basic format check)
//   const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   for (const domain of domains) {
//     if (!domainRegex.test(domain)) {
//       console.error(`❌ Invalid domain: ${domain}`);
//       res.status(400).json({ error: `Invalid domain: ${domain}` });
//       return;
//     }
//   }

//   try {
//     const existingOrg = await Organization.findOne({ name });
//     if (existingOrg) {
//       console.error(`❌ Organization already exists: ${name}`);
//       res.status(400).json({ error: 'Organization already exists' });
//       return;
//     }

//     const organization = await Organization.create({ name, domains });
//     console.log(`✅ Organization created: ${organization.name}`);
//     res.status(201).json({ success: true, organization });
//   } catch (err: any) {
//     console.error('❌ Error creating organization:', err.message);
//     res.status(500).json({ error: 'Failed to create organization' });
//   }
// });

// export default router;


import { Router, Request, Response } from 'express';
import { ensureAdminAuthenticated } from '../middleware/auth.middleware';
import { Organization } from '../models/Organization';

const router = Router();

console.log('🔗 Setting up organization routes...');

// Create an organization
router.post('/create', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const { name, domains, organizers } = req.body;
  console.log(`📝 Creating organization: ${name} with domains: ${domains}, organizers: ${organizers}`);

  // Validate input
  if (!name || !domains || !Array.isArray(domains) || domains.length === 0) {
    console.error('❌ Invalid input for organization creation');
    res.status(400).json({ error: 'Name and at least one domain are required' });
    return;
  }

  // Validate domains
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  for (const domain of domains) {
    if (!domainRegex.test(domain)) {
      console.error(`❌ Invalid domain: ${domain}`);
      res.status(400).json({ error: `Invalid domain: ${domain}` });
      return;
    }
  }

  // Validate organizers (if provided)
  if (organizers && !Array.isArray(organizers)) {
    console.error('❌ Invalid organizers format');
    res.status(400).json({ error: 'Organizers must be an array' });
    return;
  }

  try {
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      console.error(`❌ Organization already exists: ${name}`);
      res.status(400).json({ error: 'Organization already exists' });
      return;
    }

    const organization = await Organization.create({
      name,
      domains: domains.map((d: string) => d.trim().toLowerCase()),
      organizers: organizers ? organizers.map((o: string) => o.trim()) : [],
    });
    console.log(`✅ Organization created: ${organization.name}`);
    res.status(201).json({ success: true, organization });
  } catch (err: any) {
    console.error('❌ Error creating organization:', err.message);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Update an organization
router.patch('/:id/update', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { domains, organizers } = req.body;
  console.log(`📝 Updating organization ID: ${id} with domains: ${domains}, organizers: ${organizers}`);

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      console.error(`❌ Organization not found: ${id}`);
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    // Update domains
    if (domains && Array.isArray(domains)) {
      const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const newDomains = domains
        .map((d: string) => d.trim().toLowerCase())
        .filter((d: string) => domainRegex.test(d) && !organization.domains.includes(d));
      organization.domains.push(...newDomains);
    }

    // Update organizers
    if (organizers && Array.isArray(organizers)) {
      const newOrganizers = organizers
        .map((o: string) => o.trim())
        .filter((o: string) => !organization.organizers.includes(o));
      organization.organizers.push(...newOrganizers);
    }

    await organization.save();
    console.log(`✅ Organization updated: ${organization.name}`);
    res.json({ success: true, organization });
  } catch (err: any) {
    console.error('❌ Error updating organization:', err.message);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

export default router;