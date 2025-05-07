const interviewRoutes = require('./routes/interviewRoutes');
 
// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', jobRoutes);
app.use('/api/v1', applicationRoutes);
app.use('/api/v1', interviewRoutes); 