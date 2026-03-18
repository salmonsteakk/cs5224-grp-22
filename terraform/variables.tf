variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "ap-southeast-1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "learnbright"
}

variable "server_port" {
  description = "Port the Express server listens on"
  type        = number
  default     = 3001
}

variable "server_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "server_memory" {
  description = "Fargate task memory in MB"
  type        = number
  default     = 512
}
