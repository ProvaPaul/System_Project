const interviewRoutes = require('./routes/interviewRoutes');
 const uploadRouter = require('./routes/upload');
app.use('/upload', uploadRouter);

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', jobRoutes);
app.use('/api/v1', applicationRoutes);
app.use('/api/v1', interviewRoutes); 