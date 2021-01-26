// Metadata for requet types

module.exports = {
  "open_aws_account": {
    "name": "Request AWS Account",
    "description": "Request a new AWS account and charge back to the owner.",
    "url": "https://www.google.com",
    "references": [
      {
        "title": "Getting Started in AWS",
        "url": "https://www.google.com"
      },
      {
        "title": "Requesting an AWS Account",
        "url": "https://www.google.com"
      }
    ]
  },
  
  "close_aws_account": {
    "name": "Decommission AWS Account",
    "description": "Delete all resources and close the AWS account permanently.",
    "url": "https://www.google.com",
    "references": [
      {
        "title": "Decommission AWS Account",
        "url": "https://www.google.com"
      }
    ]
  },

  "access_aws_account": {
    "name": "Access AWS Account",
    "description": "AWS account access is role based, request needs to be approved by manager.",
    "url": "https://www.google.com",
    "references": [
      {
        "title": "Account Federation",
        "url": "https://www.google.com"
      },
      {
        "title": "Roles Management",
        "url": "https://www.google.com"
      }
    ]
  },

  "migrate_to_transit_gateway": {
    "name": "Migrate to Transit Gateway",
    "description": "Use transit gateway for connection to direct connect and VPC endpoints (interface type).",
    "url": "https://www.google.com",
    "references": [
      {
        "title": "AWS Transit Gateway",
        "url": "https://www.google.com"
      },
      {
        "title": "How to migrate VPC endpoints to Transit Gateway",
        "url": "https://www.google.com"
      }
    ]
  },

  "request_firewall_change": {
    "name": "Request Firewall Change",
    "description": "Firewall change is required for network communication between VPC and on-prem data centre.",
    "url": "https://www.google.com",
    "references": [
      {
        "title": "Firewall Information and Requests",
        "url": "https://www.google.com"
      }
    ]
  },

  "raise_general_support_ticket": {
    "name": "Raise General Support Ticket",
    "description": "Raise a general support ticket if you can not find the request type in the list",
    "url": "https://www.google.com",
    "references": [
        {
            "title": "Knowledge Base",
            "url": "https://www.google.com"
        }
    ]
  }

}