# Branch-User-Access-Review

A Flask-based web application designed for secure branch user access management. This application allows managers to authenticate via Active Directory, upload employee data, and make access reviews. 

---

## Features
1. **Active Directory Authentication**:
   - Only managers can log in using their credentials.
   - Role-based access control ensures security.

2. **CSV File Upload**:
   - Import employee and manager profiles via CSV.
   - Automatically saves the data to an SQLite database.

3. **Options Dropdown**:
   - Managers can select predefined options for access reviews.

4. **Data Storage**:
   - Employee details stored in a lightweight SQLite database.

---

## Prerequisites

1. Python 3.8+
2. Required Python Libraries (install via `requirements.txt`):
   - Flask
   - Flask-LDAP3-Login
   - Flask-SQLAlchemy
   - pandas

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Branch-User-Access-Review.git
   cd Branch-User-Access-Review

2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Set up your Active Directory configuration in app.py:
  ```python
  app.config['LDAP_HOST'] = 'your_ldap_host'
  app.config['LDAP_BASE_DN'] = 'DC=example,DC=com'
  app.config['LDAP_BIND_USER_DN'] = 'CN=bind_user,CN=Users,DC=example,DC=com'
  app.config['LDAP_BIND_USER_PASSWORD'] = 'bind_user_password'

4. Create necessary directories and database:
  ```bash
  mkdir uploads
  python app.py

5. Access the application: Open your browser and navigate to http://127.0.0.1:5000.
