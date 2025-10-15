from flask import Flask, render_template, request, jsonify, redirect
from datetime import datetime
import uuid
import json
import os
import sqlite3
from dotenv import load_dotenv
from contextlib import contextmanager

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config["DATABASE"] = os.getenv("DATABASE_PATH", "citycare.db")

# Database setup
def init_db():
    """Initialize the SQLite database with required tables"""
    with database_connection() as conn:
        cursor = conn.cursor()
        
        # Reports table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                id TEXT PRIMARY KEY,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                urgency_level TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                address TEXT NOT NULL,
                landmark TEXT,
                ward TEXT,
                contact_email TEXT NOT NULL,
                contact_phone TEXT,
                status TEXT DEFAULT 'submitted',
                image_paths TEXT DEFAULT '[]',
                upvotes INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Comments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS report_comments (
                id TEXT PRIMARY KEY,
                report_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                user_name TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE
            )
        ''')
        
        # WhatsApp groups table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS whatsapp_groups (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,
                link TEXT NOT NULL,
                member_count INTEGER DEFAULT 1,
                activity TEXT DEFAULT 'New',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by TEXT DEFAULT 'user'
            )
        ''')
        
        # Forum posts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS forum_posts (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT NOT NULL,
                author TEXT DEFAULT 'User',
                author_initials TEXT DEFAULT 'US',
                comments INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                likes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()

@contextmanager
def database_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(app.config["DATABASE"])
    conn.row_factory = sqlite3.Row  # This enables column access by name
    try:
        yield conn
    finally:
        conn.close()

# Initialize database
init_db()

# Helper functions for database operations
def dict_factory(cursor, row):
    """Convert database row to dictionary"""
    d = {}
    for idx, col in enumerate(cursor.description):
        value = row[idx]
        # Convert datetime strings to ISO format if needed
        if isinstance(value, str) and 'T' in value and ':' in value:
            try:
                # Try to parse as datetime
                d[col[0]] = value
            except:
                d[col[0]] = value
        else:
            d[col[0]] = value
    return d

def serialize_report(report):
    """Serialize a report with proper data types"""
    if isinstance(report, dict):
        report_dict = report
    else:
        report_dict = dict(report)
    
    # Ensure proper data types
    if 'image_paths' in report_dict and report_dict['image_paths']:
        if isinstance(report_dict['image_paths'], str):
            try:
                report_dict['image_paths'] = json.loads(report_dict['image_paths'])
            except:
                report_dict['image_paths'] = []
        else:
            report_dict['image_paths'] = report_dict['image_paths']
    else:
        report_dict['image_paths'] = []
    
    # Ensure location object is properly structured
    if 'latitude' in report_dict and 'longitude' in report_dict:
        report_dict['location'] = {
            'latitude': float(report_dict.get('latitude', 0)),
            'longitude': float(report_dict.get('longitude', 0)),
            'address': report_dict.get('address', ''),
            'landmark': report_dict.get('landmark', ''),
            'ward': report_dict.get('ward', '')
        }
    
    # Ensure contact object is properly structured
    if 'contact_email' in report_dict:
        report_dict['contact'] = {
            'email': report_dict.get('contact_email', ''),
            'phone': report_dict.get('contact_phone', '')
        }
    
    return report_dict

# Sample data initialization
def initialize_sample_data():
    """Initialize database with sample data"""
    with database_connection() as conn:
        cursor = conn.cursor()
        
        # Check if we already have data
        cursor.execute("SELECT COUNT(*) FROM reports")
        if cursor.fetchone()[0] == 0:
            print("📝 Initializing sample data...")
            
            # Sample reports
            sample_reports = [
                (
                    "report-1", "Road Issues", "Large pothole on Main Street",
                    "There's a dangerous pothole near the intersection of Main and 5th Street",
                    "high", 20.5937, 78.9629, "Main Street, City Center", 
                    "Near Central Park", "Ward 5", "user@example.com", "+1234567890",
                    "submitted", "[]", 5, 2
                ),
                (
                    "report-2", "Garbage Collection", "Garbage not collected for 3 days",
                    "The garbage truck hasn't come to our area for 3 consecutive days",
                    "medium", 20.5940, 78.9630, "Green Park Residence",
                    "Behind City Mall", "Ward 3", "user2@example.com", "+1234567891",
                    "in-progress", "[]", 3, 1
                ),
                (
                    "report-3", "Water Supply", "No water supply since morning",
                    "There has been no water supply in our area since 8 AM today",
                    "high", 20.5950, 78.9640, "River View Apartments",
                    "Near Police Station", "Ward 4", "user3@example.com", "+1234567892",
                    "submitted", "[]", 2, 0
                )
            ]
            
            cursor.executemany('''
                INSERT INTO reports (id, category, title, description, urgency_level, 
                latitude, longitude, address, landmark, ward, contact_email, contact_phone,
                status, image_paths, upvotes, comments_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', sample_reports)
            
            # Sample comments
            sample_comments = [
                ("comment-1", "report-1", "user1", "John Doe", "This has been here for weeks!", datetime.utcnow().isoformat()),
                ("comment-2", "report-1", "user2", "Jane Smith", "I almost fell here yesterday!", datetime.utcnow().isoformat()),
                ("comment-3", "report-2", "user3", "Mike Johnson", "Same issue in my area too", datetime.utcnow().isoformat())
            ]
            
            cursor.executemany('''
                INSERT INTO report_comments (id, report_id, user_id, user_name, text, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', sample_comments)
            
            # Sample WhatsApp groups
            sample_groups = [
                (
                    "group-1", "City Care - Ward 5 Residents",
                    "Group for residents of Ward 5 to discuss civic issues", "Ward 5",
                    "https://chat.whatsapp.com/example1", 45, "Active"
                ),
                (
                    "group-2", "Road Safety Volunteers",
                    "Group for reporting and discussing road safety issues", "City Wide",
                    "https://chat.whatsapp.com/example2", 89, "Very Active"
                )
            ]
            
            cursor.executemany('''
                INSERT INTO whatsapp_groups (id, name, description, location, link, member_count, activity)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', sample_groups)
            
            # Sample forum posts
            sample_posts = [
                (
                    "post-1", "How to effectively report water supply issues?",
                    "I've been facing water supply problems in my area. What's the best way to get this resolved quickly?",
                    "Water Supply", "Community Member", "CM", 7, 124, 15
                ),
                (
                    "post-2", "Property Tax Payment Issues",
                    "Has anyone else faced issues with the online property tax payment portal?",
                    "Taxes", "Tax Payer", "TP", 12, 256, 8
                )
            ]
            
            cursor.executemany('''
                INSERT INTO forum_posts (id, title, content, category, author, author_initials, comments, views, likes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', sample_posts)
            
            conn.commit()
            print("✅ Sample data initialized successfully")

# Initialize sample data
initialize_sample_data()

# Routes
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/report')
def report():
    return render_template('report.html')

@app.route('/track')
def track():
    return render_template('track.html')

@app.route('/viewmap')
def viewmap():
    return render_template('viewmap.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/admin')
def admin_login_page():
    """Show admin login page"""
    return render_template('admin.html')

@app.route('/dashboard')
def dashboard():
    """Show admin dashboard (protected)"""
    # Get admin stats
    with database_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM reports")
        total_reports = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM reports WHERE status = 'submitted'")
        pending_reports = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM reports WHERE status = 'resolved'")
        resolved_reports = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT contact_email) FROM reports")
        total_users = cursor.fetchone()[0]
    
    return render_template('dashboard.html', 
                         total_reports=total_reports,
                         pending_reports=pending_reports,
                         resolved_reports=resolved_reports,
                         total_users=total_users)

# Admin Authentication Routes
@app.route('/admin/login', methods=['POST'])
def admin_login():
    """Handle admin login"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Admin credentials
        admin_credentials = [
            {"name": "admin", "secretKey": "admin123"},
            {"name": "citycare", "secretKey": "citycare2024"},
            {"name": "administrator", "secretKey": "admin@123"},
            {"name": "superadmin", "secretKey": "super@2024"},
            {"name": "vansh", "secretKey": "team-btech aale"}
        ]
        
        # Check credentials
        is_valid = any(
            cred["name"].lower() == username.lower() and 
            cred["secretKey"] == password 
            for cred in admin_credentials
        )
        
        if is_valid:
            return jsonify({
                'success': True, 
                'message': 'Login successful',
                'user': {
                    'name': username,
                    'role': 'Administrator'
                }
            })
        else:
            return jsonify({
                'success': False, 
                'message': 'Invalid admin credentials'
            }), 401
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/admin/logout')
def admin_logout():
    """Handle admin logout"""
    return redirect('/admin')

# Admin API endpoints
@app.route('/api/admin/reports')
def get_admin_reports():
    """Get all reports for admin panel"""
    try:
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM reports 
                ORDER BY created_at DESC
            ''')
            reports = cursor.fetchall()
            
            # Convert JSON strings
            for report in reports:
                if report.get('image_paths'):
                    report['image_paths'] = json.loads(report['image_paths'])
            
        return jsonify({'success': True, 'reports': reports})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/reports/<report_id>/status', methods=['PUT'])
def update_report_status_admin(report_id):
    """Update report status (admin version)"""
    try:
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ['submitted', 'in-progress', 'resolved']:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400

        with database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE reports 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (new_status, report_id))
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            conn.commit()

        return jsonify({'success': True, 'message': 'Status updated successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error updating status: {str(e)}'}), 500

@app.route('/api/admin/users')
def get_admin_users():
    """Get all users for admin panel"""
    try:
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    contact_email as email,
                    COUNT(*) as report_count,
                    MAX(created_at) as last_activity,
                    MIN(created_at) as joined_date
                FROM reports 
                GROUP BY contact_email
                ORDER BY last_activity DESC
            ''')
            users = cursor.fetchall()
            
        return jsonify({'success': True, 'users': users})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/analytics')
def get_admin_analytics():
    """Get analytics data for admin panel"""
    try:
        with database_connection() as conn:
            cursor = conn.cursor()
            
            # Category distribution
            cursor.execute('''
                SELECT category, COUNT(*) as count 
                FROM reports 
                GROUP BY category 
                ORDER BY count DESC
            ''')
            category_stats = cursor.fetchall()
            
            # Status distribution
            cursor.execute('''
                SELECT status, COUNT(*) as count 
                FROM reports 
                GROUP BY status 
                ORDER BY count DESC
            ''')
            status_stats = cursor.fetchall()
            
            # Urgency distribution
            cursor.execute('''
                SELECT urgency_level, COUNT(*) as count 
                FROM reports 
                GROUP BY urgency_level 
                ORDER BY count DESC
            ''')
            urgency_stats = cursor.fetchall()
            
            # Recent activity (last 7 days)
            cursor.execute('''
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as report_count
                FROM reports 
                WHERE created_at >= DATE('now', '-7 days')
                GROUP BY DATE(created_at)
                ORDER BY date
            ''')
            recent_activity = cursor.fetchall()
            
            # Ward-wise distribution
            cursor.execute('''
                SELECT ward, COUNT(*) as count 
                FROM reports 
                WHERE ward IS NOT NULL AND ward != ''
                GROUP BY ward 
                ORDER BY count DESC
                LIMIT 10
            ''')
            ward_stats = cursor.fetchall()

        return jsonify({
            'success': True,
            'analytics': {
                'categories': [dict(row) for row in category_stats],
                'status': [dict(row) for row in status_stats],
                'urgency': [dict(row) for row in urgency_stats],
                'recent_activity': [dict(row) for row in recent_activity],
                'wards': [dict(row) for row in ward_stats]
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/reports/<report_id>/details')
def get_report_details(report_id):
    """Get detailed report information"""
    try:
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            
            # Get report
            cursor.execute('SELECT * FROM reports WHERE id = ?', (report_id,))
            report = cursor.fetchone()
            
            if not report:
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            # Get comments
            cursor.execute('''
                SELECT * FROM report_comments 
                WHERE report_id = ? 
                ORDER BY created_at
            ''', (report_id,))
            comments = cursor.fetchall()
            
            # Serialize report
            serialized_report = serialize_report(report)
            serialized_report['comments'] = [dict(comment) for comment in comments]

        return jsonify({'success': True, 'report': serialized_report})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """Delete a report"""
    try:
        with database_connection() as conn:
            cursor = conn.cursor()
            
            # Delete comments first (due to foreign key constraint)
            cursor.execute('DELETE FROM report_comments WHERE report_id = ?', (report_id,))
            
            # Delete report
            cursor.execute('DELETE FROM reports WHERE id = ?', (report_id,))
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            conn.commit()

        return jsonify({'success': True, 'message': 'Report deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# API Routes
@app.route('/api/submit-report', methods=['POST'])
def submit_report():
    try:
        data = request.get_json()
        print(f"📨 Received report submission: {data}")

        required_fields = ['category', 'title', 'description', 'urgency_level', 'latitude', 'longitude', 'address', 'contact_email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        report_id = str(uuid.uuid4())
        
        with database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO reports (id, category, title, description, urgency_level, 
                latitude, longitude, address, landmark, ward, contact_email, contact_phone, image_paths)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                report_id, 
                data.get('category'), 
                data.get('title'), 
                data.get('description'),
                data.get('urgency_level'), 
                float(data.get('latitude')), 
                float(data.get('longitude')),
                data.get('address'), 
                data.get('landmark', ''), 
                data.get('ward', ''),
                data.get('contact_email'), 
                data.get('contact_phone', ''), 
                json.dumps(data.get('image_paths', []))
            ))
            conn.commit()

        print(f"✅ Report saved with ID: {report_id}")
        return jsonify({
            'success': True,
            'message': 'Report submitted successfully!',
            'report_id': report_id
        })

    except Exception as e:
        print(f"❌ Error submitting report: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error submitting report: {str(e)}'
        }), 500

@app.route('/api/user-reports', methods=['GET'])
def get_user_reports():
    try:
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM reports 
                ORDER BY created_at DESC
            ''')
            reports = cursor.fetchall()
            
            # Serialize each report
            serialized_reports = []
            for report in reports:
                serialized_report = serialize_report(report)
                
                # Get comments for this report
                cursor.execute('''
                    SELECT * FROM report_comments 
                    WHERE report_id = ? 
                    ORDER BY created_at
                ''', (serialized_report['id'],))
                comments = cursor.fetchall()
                serialized_report['comments'] = [dict(comment) for comment in comments]
                
                serialized_reports.append(serialized_report)

        print(f"📊 Returning {len(serialized_reports)} reports")
        return jsonify({
            'success': True,
            'reports': serialized_reports
        })

    except Exception as e:
        print(f"❌ Error fetching reports: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error fetching reports: {str(e)}'
        }), 500

@app.route('/api/reports/filter', methods=['POST'])
def get_filtered_reports():
    try:
        data = request.get_json()
        
        query = "SELECT * FROM reports WHERE 1=1"
        params = []
        
        if data.get('status') and len(data['status']) > 0:
            placeholders = ','.join(['?'] * len(data['status']))
            query += f" AND status IN ({placeholders})"
            params.extend(data['status'])
        
        if data.get('categories') and len(data['categories']) > 0:
            placeholders = ','.join(['?'] * len(data['categories']))
            query += f" AND category IN ({placeholders})"
            params.extend(data['categories'])
        
        if data.get('search'):
            query += " AND (title LIKE ? OR description LIKE ? OR address LIKE ?)"
            search_term = f"%{data['search']}%"
            params.extend([search_term, search_term, search_term])
        
        query += " ORDER BY created_at DESC"
        
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            cursor.execute(query, params)
            filtered_reports = cursor.fetchall()
            
            # Serialize reports
            serialized_reports = [serialize_report(report) for report in filtered_reports]

        return jsonify({
            'success': True,
            'reports': serialized_reports,
            'total': len(serialized_reports)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error filtering reports: {str(e)}'
        }), 500

@app.route('/api/reports/stats', methods=['GET'])
def get_report_stats():
    try:
        with database_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM reports WHERE status = 'submitted'")
            submitted_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM reports WHERE status = 'in-progress'")
            in_progress_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM reports WHERE status = 'resolved'")
            resolved_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM reports")
            total_count = cursor.fetchone()[0]

        return jsonify({
            'success': True,
            'stats': {
                'submitted': submitted_count,
                'in_progress': in_progress_count,
                'resolved': resolved_count,
                'total': total_count
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching statistics: {str(e)}'
        }), 500

@app.route('/api/reports/<report_id>/comment', methods=['POST'])
def add_comment(report_id):
    try:
        data = request.get_json()
        comment_id = str(uuid.uuid4())
        
        with database_connection() as conn:
            cursor = conn.cursor()
            
            # Check if report exists
            cursor.execute("SELECT id FROM reports WHERE id = ?", (report_id,))
            if not cursor.fetchone():
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            # Insert comment
            cursor.execute('''
                INSERT INTO report_comments (id, report_id, user_id, user_name, text)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                comment_id, report_id, 
                data.get('user_id', 'anonymous'),
                data.get('user_name', 'Anonymous'),
                data.get('text')
            ))
            
            # Update comments count
            cursor.execute('''
                UPDATE reports 
                SET comments_count = comments_count + 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (report_id,))
            
            conn.commit()

        return jsonify({'success': True, 'message': 'Comment added successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error adding comment: {str(e)}'}), 500

@app.route('/api/reports/<report_id>/status', methods=['PUT'])
def update_report_status(report_id):
    try:
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ['submitted', 'in-progress', 'resolved']:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400

        with database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE reports 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (new_status, report_id))
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            conn.commit()

        return jsonify({'success': True, 'message': 'Status updated successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error updating status: {str(e)}'}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page

        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            
            # Get paginated reports
            cursor.execute('''
                SELECT * FROM reports 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            ''', (per_page, skip))
            paginated_reports = cursor.fetchall()
            
            # Get total count
            cursor.execute("SELECT COUNT(*) FROM reports")
            total = cursor.fetchone()[0]
            
            # Serialize reports
            serialized_reports = [serialize_report(report) for report in paginated_reports]

        return jsonify({
            'success': True,
            'reports': serialized_reports,
            'total': total,
            'page': page,
            'per_page': per_page
        })

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching reports: {str(e)}'}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    try:
        with database_connection() as conn:
            conn.row_factory = dict_factory
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM reports WHERE id = ?', (report_id,))
            report = cursor.fetchone()
            
            if not report:
                return jsonify({'success': False, 'message': 'Report not found'}), 404
            
            # Serialize report
            serialized_report = serialize_report(report)
            
            # Get comments
            cursor.execute('''
                SELECT * FROM report_comments 
                WHERE report_id = ? 
                ORDER BY created_at
            ''', (report_id,))
            comments = cursor.fetchall()
            serialized_report['comments'] = [dict(comment) for comment in comments]

        return jsonify({'success': True, 'report': serialized_report})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching report: {str(e)}'}), 500

# WhatsApp Groups API
@app.route('/api/whatsapp-groups', methods=['GET', 'POST'])
def handle_whatsapp_groups():
    if request.method == 'GET':
        try:
            with database_connection() as conn:
                conn.row_factory = dict_factory
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM whatsapp_groups')
                groups = cursor.fetchall()
                
            return jsonify({'success': True, 'groups': [dict(group) for group in groups]})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json()
            group_id = str(uuid.uuid4())
            
            with database_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO whatsapp_groups (id, name, description, location, link)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    group_id, data.get('name'), data.get('description'),
                    data.get('location'), data.get('link')
                ))
                conn.commit()
                
            return jsonify({'success': True, 'message': 'Group created successfully'})

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

# Forum Posts API
@app.route('/api/forum-posts', methods=['GET', 'POST'])
def handle_forum_posts():
    if request.method == 'GET':
        try:
            with database_connection() as conn:
                conn.row_factory = dict_factory
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT * FROM forum_posts 
                    ORDER BY created_at DESC 
                    LIMIT 10
                ''')
                posts = cursor.fetchall()
                
            return jsonify({'success': True, 'posts': [dict(post) for post in posts]})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json()
            post_id = str(uuid.uuid4())
            
            with database_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO forum_posts (id, title, content, category)
                    VALUES (?, ?, ?, ?)
                ''', (
                    post_id, data.get('title'), data.get('content'), data.get('category')
                ))
                conn.commit()
                
            return jsonify({'success': True, 'message': 'Post created successfully'})

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

# Chat API Route
@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        language = data.get('language', 'en')

        response = generate_ai_response(user_message, language)

        return jsonify({
            'success': True,
            'reply': response
        })

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error in chat: {str(e)}'}), 500

def generate_ai_response(message, language):
    message_lower = message.lower()

    response_templates = {
        'report': "I can help you report a civic issue! You can file a report directly through our system. The report page will guide you through the process step by step.",
        'track': "You can track your reported issues in the tracking section. It shows the current status, updates, and estimated resolution time for each report.",
        'pothole': "For pothole reports, please provide the exact location, size, and a photo if possible. This helps our teams address the issue quickly.",
        'garbage': "Garbage collection schedules vary by area. You can check your area's schedule or report missed collections through our system.",
        'water': "Water supply issues should be reported immediately. Please provide your location and nature of the problem for quick resolution.",
        'tax': "Property tax payments can be made online through our portal. You'll need your property ID and can choose from multiple payment options.",
        'hello': "Hello! I'm CityCare Assistant. I can help you report civic issues, track existing reports, find city services, and answer questions about local governance.",
        'thanks': "You're welcome! I'm here to help anytime. Feel free to ask if you need assistance with any civic matters."
    }

    for keyword, response in response_templates.items():
        if keyword in message_lower:
            return response

    return "I understand you're asking about civic matters. I can help you with reporting issues, tracking reports, finding city services, or answering questions about local governance. What would you like to know more about?"

# Test and Health endpoints
@app.route('/api/test')
def test_api():
    with database_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM reports")
        reports_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM whatsapp_groups")
        groups_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM forum_posts")
        posts_count = cursor.fetchone()[0]

    return jsonify({
        'success': True,
        'message': 'API is working!',
        'database': 'SQLite',
        'timestamp': datetime.utcnow().isoformat(),
        'reports_count': reports_count,
        'groups_count': groups_count,
        'posts_count': posts_count
    })

@app.route('/api/health')
def health_check():
    with database_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM reports")
        reports = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM whatsapp_groups")
        groups = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM forum_posts")
        posts = cursor.fetchone()[0]

    return jsonify({
        'status': 'healthy',
        'database': 'sqlite',
        'timestamp': datetime.utcnow().isoformat(),
        'reports': reports,
        'groups': groups,
        'posts': posts
    })

if __name__ == '__main__':
    print("🚀 Starting CityCare Application...")
    print("📊 Database: SQLite (Fast & Lightweight)")
    print("📱 CityCare is running on http://localhost:5000")
    print("💡 Press Ctrl+C to stop the server")
    print("\nAvailable endpoints:")
    print("  • /api/test - Test API connectivity")
    print("  • /api/health - Health check")
    print("  • /api/reports - Get all reports")
    print("  • /api/submit-report - Submit new report")
    print("  • /api/chat - AI Chat endpoint")
    print("  • /admin - Admin login")
    print("  • /dashboard - Admin dashboard")
    print("-" * 50)

    app.run(debug=True, port=5000, use_reloader=False)