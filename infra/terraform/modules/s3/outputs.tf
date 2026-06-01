output "bucket_name" {
  description = "Name of the S3 attachments bucket"
  value       = aws_s3_bucket.attachments.bucket
}

output "bucket_arn" {
  description = "ARN of the S3 attachments bucket"
  value       = aws_s3_bucket.attachments.arn
}

output "bucket_domain_name" {
  description = "Bucket domain name"
  value       = aws_s3_bucket.attachments.bucket_domain_name
}

output "bucket_id" {
  description = "ID of the S3 attachments bucket"
  value       = aws_s3_bucket.attachments.id
}
