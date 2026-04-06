---
title: "Lessons from Building with Terraform"
date: "2025-11-05"
description: "Things I wish I knew before managing infrastructure as code for the first time."
tags: ["devops", "terraform", "infrastructure"]
---

Managing infrastructure as code sounds straightforward until you're an hour into a `terraform apply` that's silently doing nothing.

## Start with remote state

The very first thing you should configure is remote state. Local state files are fine for experiments, but the moment you share anything with another machine, team member, or CI pipeline, you'll regret not having done this from the start.

```hcl
terraform {
  backend "s3" {
    bucket = "my-tf-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Modules are worth it early

Breaking infrastructure into reusable modules feels like over-engineering on day one. By week two, you're thankful. A module for your VPC, a module for your ECS service, a module for your IAM roles — each one becomes a lego brick you can compose and reuse.

## Don't fear `terraform import`

If you have existing resources that weren't created by Terraform, `terraform import` is your friend. Yes, it's tedious. Yes, you have to write the resource block first. But it's far better than destroying and recreating production resources.

## Drift happens

Real-world infrastructure drifts from its Terraform state over time — someone makes a manual change in the console, a service auto-scales, a policy gets attached by an automated tool. Run `terraform plan` regularly in CI to catch drift before it becomes an incident.

Infrastructure as code is a discipline, not a tool. The tool just helps you enforce it.
