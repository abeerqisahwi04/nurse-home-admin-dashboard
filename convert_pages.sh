#!/bin/bash

# Convert Dashboard.tsx to Dashboard.jsx
cat src/app/pages/Dashboard.tsx | \
sed 's/: number//g; s/: string//g' | \
sed '/^type /d; /^interface /d' | \
sed '1,/^const /s/^const /\/\/ Converted from TypeScript\nconst /' > src/app/pages/Dashboard.jsx

# Convert NurseVerification.tsx to NurseVerification.jsx
cat src/app/pages/NurseVerification.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]* | null>//g; s/<[A-Za-z]*>//g; s/as [A-Za-z]* | "[^"]*"//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/NurseVerification.jsx

# Convert UsersManagement.tsx to UsersManagement.jsx
cat src/app/pages/UsersManagement.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]*>//g; s/as [A-Za-z]* | "[^"]*"//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/UsersManagement.jsx

# Convert ServiceRequests.tsx to ServiceRequests.jsx
cat src/app/pages/ServiceRequests.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]* | null>//g; s/<[A-Za-z]*>//g; s/as [A-Za-z]* | "[^"]*"//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/ServiceRequests.jsx

# Convert PaymentTransactions.tsx to PaymentTransactions.jsx
cat src/app/pages/PaymentTransactions.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]* | "[^"]*">//g; s/<[A-Za-z]*>//g; s/as [A-Za-z]* | "[^"]*"//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/PaymentTransactions.jsx

# Convert ComplaintsSupport.tsx to ComplaintsSupport.jsx
cat src/app/pages/ComplaintsSupport.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]* | null>//g; s/<[A-Za-z]*>//g; s/as [A-Za-z]* | "[^"]*"//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/ComplaintsSupport.jsx

# Convert NotificationsAnnouncements.tsx to NotificationsAnnouncements.jsx
cat src/app/pages/NotificationsAnnouncements.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]*>//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/NotificationsAnnouncements.jsx

# Convert Reports.tsx to Reports.jsx
cat src/app/pages/Reports.tsx | \
sed 's/(format: string)/(format)/g; s/: string//g' > src/app/pages/Reports.jsx

# Convert AdminManagement.tsx to AdminManagement.jsx
cat src/app/pages/AdminManagement.tsx | \
sed 's/: [A-Za-z]*//g; s/<[A-Za-z]*>//g' | \
sed '/^type /d; /^interface /d' > src/app/pages/AdminManagement.jsx

# Convert Settings.tsx to Settings.jsx
cp src/app/pages/Settings.tsx src/app/pages/Settings.jsx

echo "Conversion complete!"
