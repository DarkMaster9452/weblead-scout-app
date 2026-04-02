import { neon } from "@neondatabase/serverless";

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

async function initializeDatabase(sql) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        address TEXT,
        phone VARCHAR(20),
        website VARCHAR(255),
        has_website BOOLEAN DEFAULT FALSE,
        website_score INTEGER DEFAULT 0,
        website_issues TEXT[] DEFAULT '{}',
        quality VARCHAR(50),
        area VARCHAR(100),
        status VARCHAR(50) DEFAULT 'new',
        email_sent BOOLEAN DEFAULT FALSE,
        proposal_sent BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

async function listLeads(sql, area = null) {
  let query = sql`SELECT * FROM leads ORDER BY created_at DESC`;

  if (area) {
    query = sql`SELECT * FROM leads WHERE area = ${area} ORDER BY created_at DESC`;
  }

  return await query;
}

async function createLead(sql, lead) {
  const {
    name,
    category,
    address,
    phone,
    website,
    has_website,
    website_score,
    website_issues,
    quality,
    area,
  } = lead;

  const result = await sql`
    INSERT INTO leads (
      name,
      category,
      address,
      phone,
      website,
      has_website,
      website_score,
      website_issues,
      quality,
      area
    ) VALUES (
      ${name},
      ${category || null},
      ${address || null},
      ${phone || null},
      ${website || null},
      ${has_website || false},
      ${website_score || 0},
      ${website_issues ? JSON.stringify(website_issues) : null},
      ${quality || null},
      ${area || null}
    )
    RETURNING *
  `;

  return result[0];
}

async function updateLeadStatus(sql, id, updates) {
  const { status, email_sent, proposal_sent, notes } = updates;

  const updateFields = [];
  const updateValues = [];
  let fieldCount = 1;

  if (status !== undefined) {
    updateFields.push(`status = $${fieldCount}`);
    updateValues.push(status);
    fieldCount++;
  }

  if (email_sent !== undefined) {
    updateFields.push(`email_sent = $${fieldCount}`);
    updateValues.push(email_sent);
    fieldCount++;
  }

  if (proposal_sent !== undefined) {
    updateFields.push(`proposal_sent = $${fieldCount}`);
    updateValues.push(proposal_sent);
    fieldCount++;
  }

  if (notes !== undefined) {
    updateFields.push(`notes = $${fieldCount}`);
    updateValues.push(notes);
    fieldCount++;
  }

  updateFields.push(`updated_at = NOW()`);

  const query = `UPDATE leads SET ${updateFields.join(", ")} WHERE id = $${fieldCount} RETURNING *`;
  updateValues.push(id);

  const result = await sql(query, updateValues);
  return result[0];
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await initializeDatabase(sql);

    if (req.method === "GET") {
      const { area } = req.query;
      const leads = await listLeads(sql, area);
      res.status(200).json({
        success: true,
        count: leads.length,
        leads,
      });
      return;
    }

    if (req.method === "POST") {
      const lead = req.body;

      if (!lead.name) {
        res.status(400).json({
          error: "Missing required field: name",
        });
        return;
      }

      const newLead = await createLead(sql, lead);
      res.status(201).json({
        success: true,
        lead: newLead,
      });
      return;
    }

    if (req.method === "PATCH") {
      const { id } = req.query;
      const updates = req.body;

      if (!id) {
        res.status(400).json({
          error: "Missing required parameter: id",
        });
        return;
      }

      const updatedLead = await updateLeadStatus(sql, id, updates);
      res.status(200).json({
        success: true,
        lead: updatedLead,
      });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Leads API error:", error);
    res.status(500).json({
      error: "Database operation failed",
      message: error.message,
    });
  }
}
