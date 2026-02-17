#!/usr/bin/env python3
"""
Backend API Testing for CV Application
Tests all CV-related endpoints including PDF export functionality
"""

import requests
import sys
import json
from datetime import datetime
import base64

class CVAPITester:
    def __init__(self, base_url="https://resume-generator-11.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            print(f"❌ {test_name} - {details}")
            self.errors.append(f"{test_name}: {details}")

    def test_hello_world(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            success = response.status_code == 200 and "Hello World" in response.json().get("message", "")
            self.log_result("Hello World API", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("Hello World API", False, str(e))
            return False

    def test_get_cv_data(self):
        """Test GET /api/cv-data endpoint"""
        try:
            response = requests.get(f"{self.api_base}/cv-data", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            # Check if we get CV data structure
            if success and data:
                has_name = "name" in data
                has_email = "email" in data
                success = has_name and has_email
                details = f"Status: {response.status_code}, has_name: {has_name}, has_email: {has_email}"
            else:
                details = f"Status: {response.status_code}, empty response"
            
            self.log_result("GET CV Data", success, details if not success else "")
            return success, data
        except Exception as e:
            self.log_result("GET CV Data", False, str(e))
            return False, {}

    def test_post_cv_data(self):
        """Test POST /api/cv-data endpoint"""
        test_data = {
            "name": "Test Name",
            "email": "test@example.com",
            "phone": "+123456789",
            "title_hr": "Test Title HR",
            "title_en": "Test Title EN",
            "about_hr": "Test about HR",
            "about_en": "Test about EN"
        }
        
        try:
            response = requests.post(
                f"{self.api_base}/cv-data",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200
            result = response.json() if success else {}
            
            if success:
                success = result.get("success", False) and "saved successfully" in result.get("message", "")
            
            self.log_result("POST CV Data", success, f"Status: {response.status_code}" if not success else "")
            return success
        except Exception as e:
            self.log_result("POST CV Data", False, str(e))
            return False

    def test_export_pdf(self):
        """Test PDF export endpoint"""
        # Sample CV data for PDF generation
        cv_data = {
            "name": "Mediha Dubravić",
            "email": "mediha.dubravic@gmail.com",
            "phone": "(+385) 976483495",
            "title": "Profesorica engleskog jezika i književnosti",
            "about": "Profesorica engleskog jezika i književnosti s iskustvom u poučavanju.",
            "address": "Zagreb, Hrvatska",
            "dateOfBirth": "30/05/1986",
            "citizenship": "Hrvatsko",
            "gender": "Žensko",
            "maritalStatus": "Udana",
            "drivingLicense": "B",
            "experience": [
                {
                    "dates": "2021 - danas",
                    "location": "Zagreb",
                    "position": "Vlasnica",
                    "company": "S.O.S English",
                    "description": "Content marketing i prevođenje"
                }
            ],
            "education": [
                {
                    "dates": "2004 - 2010",
                    "location": "Tuzla",
                    "degree": "Magistra engleskog jezika",
                    "institution": "Sveučilište u Tuzli"
                }
            ],
            "skills": ["Content marketing", "Prevođenje", "Poučavanje"],
            "motherTongues": ["Bosanski", "Hrvatski"],
            "otherLanguages": [
                {"name": "Engleski", "level": "C2"}
            ],
            "customSections": [],
            "labels": {
                "contact": "Kontakt",
                "personalInfo": "Osobni podaci",
                "about": "O meni",
                "experience": "Radno iskustvo",
                "education": "Obrazovanje",
                "skills": "Vještine",
                "languages": "Jezici",
                "motherTongue": "Materinski jezik",
                "otherLanguages": "Ostali jezici",
                "dateOfBirth": "Datum rođenja",
                "citizenship": "Državljanstvo",
                "gender": "Spol",
                "maritalStatus": "Bračni status",
                "drivingLicense": "Vozačka dozvola"
            }
        }
        
        pdf_request = {
            "language": "HR",
            "cvData": cv_data
        }
        
        try:
            response = requests.post(
                f"{self.api_base}/export-pdf",
                json=pdf_request,
                headers={"Content-Type": "application/json"},
                timeout=30  # PDF generation can take longer
            )
            
            success = response.status_code == 200
            
            if success:
                # Check if it's actually a PDF by looking for PDF header
                content = response.content
                is_pdf = content.startswith(b'%PDF-')
                success = is_pdf
                
                # Check Content-Type header
                content_type = response.headers.get('Content-Type', '')
                has_pdf_content_type = 'application/pdf' in content_type
                
                # Check Content-Disposition for filename
                content_disposition = response.headers.get('Content-Disposition', '')
                has_filename = 'Mediha_Dubravic_CV_Europass' in content_disposition
                
                details = f"PDF_header: {is_pdf}, Content-Type: {has_pdf_content_type}, Filename: {has_filename}, Size: {len(content)} bytes"
                print(f"📊 PDF Details: {details}")
                
                # Save PDF for inspection if it's valid
                if is_pdf and len(content) > 1000:  # At least 1KB
                    with open('/tmp/test_cv.pdf', 'wb') as f:
                        f.write(content)
                    print(f"📄 PDF saved to /tmp/test_cv.pdf ({len(content)} bytes)")
            else:
                # Try to get error details
                try:
                    error_data = response.json()
                    details = f"Status: {response.status_code}, Error: {error_data.get('error', 'Unknown')}"
                except:
                    details = f"Status: {response.status_code}, Content: {response.content[:200]}"
            
            self.log_result("PDF Export", success, details if not success else "")
            return success
        except Exception as e:
            self.log_result("PDF Export", False, str(e))
            return False

    def test_image_upload(self):
        """Test image upload endpoint"""
        # Create a simple test image (1x1 pixel PNG)
        import base64
        # Minimal PNG data (1x1 transparent pixel)
        png_data = base64.b64decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII='
        )
        
        try:
            files = {'file': ('test.png', png_data, 'image/png')}
            response = requests.post(
                f"{self.api_base}/upload-image",
                files=files,
                timeout=10
            )
            
            success = response.status_code == 200
            if success:
                result = response.json()
                success = result.get("success", False) and "imageUrl" in result
                if success:
                    image_url = result["imageUrl"]
                    # Check if it's a data URL
                    success = image_url.startswith("data:image/")
            
            self.log_result("Image Upload", success, f"Status: {response.status_code}" if not success else "")
            return success
        except Exception as e:
            self.log_result("Image Upload", False, str(e))
            return False

    def run_all_tests(self):
        """Run all tests"""
        print(f"🧪 Starting CV API Tests - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🔗 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_hello_world():
            print("❌ Cannot connect to backend - stopping tests")
            return False
        
        # Test CV data endpoints
        cv_get_success, cv_data = self.test_get_cv_data()
        cv_post_success = self.test_post_cv_data()
        
        # Test file operations
        image_upload_success = self.test_image_upload()
        
        # Test PDF export (most critical)
        pdf_success = self.test_export_pdf()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.errors:
            print("\n❌ Failed tests:")
            for error in self.errors:
                print(f"  • {error}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success rate: {success_rate:.1f}%")
        
        # Critical functionality check
        critical_passed = pdf_success and cv_get_success
        if critical_passed:
            print("🎯 Critical functionality (PDF export + CV data) is working!")
        else:
            print("⚠️  Critical functionality issues detected")
        
        return success_rate >= 80  # 80% pass rate required

def main():
    tester = CVAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())