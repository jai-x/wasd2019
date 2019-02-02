const waitForReplicants = (...reps) => (
  new Promise((resolve) => {
    const num = reps.length;
    let done = 0;
    reps.forEach((rep) => {
      rep.once('change', () => {
        done += 1;
        if (done === num) {
          resolve();
        }
      });
    });
  })
);

module.exports = { waitForReplicants };
