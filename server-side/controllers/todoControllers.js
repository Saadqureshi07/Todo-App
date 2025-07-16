const pool = require('../db/db');

exports.getTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.log("Error in getTodos:", err);
  }
};

exports.createTodo = async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
      [title, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error creating todo' });
  }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  try {
    // Dono fields ka handling
    let fields = [];
    let values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }

    if (completed !== undefined) {
      fields.push(`completed = $${idx++}`);
      values.push(completed);
    }

    values.push(id); // ID last me
    const query = `UPDATE todos SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Error updating todo" });
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
};
