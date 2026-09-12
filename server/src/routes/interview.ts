import { Router } from 'express';

const router = Router();

// Route to fetch generated rubric for a candidate
router.get('/:candidateId/rubric', (req, res) => {
  res.json({ message: "Rubric generation not implemented yet." });
});

export default router;
