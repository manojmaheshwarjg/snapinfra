# Comprehensive API Testing Script for Snapinfra Backend
# Run with: .\test-all-endpoints.ps1

$baseUrl = "http://localhost:5000/api"
$testUserId = "test-user-123"
$headers = @{
    "Content-Type" = "application/json"
    "x-dev-user-id" = $testUserId
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Snapinfra Backend API Testing" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = $headers,
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -in 200..299) {
            Write-Host "[✓] $Name" -ForegroundColor Green
            $script:testResults += [PSCustomObject]@{
                Name = $Name
                Status = "PASS"
                Code = $response.StatusCode
            }
            return $true
        }
    } 
    catch {
        Write-Host "[✗] $Name - $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{
            Name = $Name
            Status = "FAIL"
            Code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
        }
        return $false
    }
}

# Test Health
Write-Host "`n--- Health Check ---" -ForegroundColor Yellow
Test-Endpoint "Health Check" "GET" "/health"

# Test Home
Write-Host "`n--- Home ---" -ForegroundColor Yellow
Test-Endpoint "Get Home" "GET" "/home"

# Test Dashboard
Write-Host "`n--- Dashboard ---" -ForegroundColor Yellow
Test-Endpoint "Get Dashboard" "GET" "/dashboard"
Test-Endpoint "Get Dashboard Metrics" "GET" "/dashboard/metrics"
Test-Endpoint "Get Recent Activity" "GET" "/dashboard/recent-activity"

# Test Projects
Write-Host "`n--- Projects ---" -ForegroundColor Yellow
Test-Endpoint "List Projects" "GET" "/projects"

$projectData = @{
    name = "Test Project"
    description = "Test project from automated tests"
    schema = @{
        name = "TestSchema"
        tables = @(
            @{
                id = "table1"
                name = "Users"
                fields = @(
                    @{
                        id = "field1"
                        name = "id"
                        type = "string"
                        isPrimary = $true
                        isRequired = $true
                    }
                )
                indexes = @()
            }
        )
        relationships = @()
    }
}
Test-Endpoint "Create Project" "POST" "/projects" $headers $projectData

# Test Schemas
Write-Host "`n--- Schemas ---" -ForegroundColor Yellow
Test-Endpoint "List Schemas" "GET" "/schemas"

# Test Architecture
Write-Host "`n--- Architecture ---" -ForegroundColor Yellow
Test-Endpoint "List Architectures" "GET" "/architecture"

# Test Code Gen
Write-Host "`n--- Code Generation ---" -ForegroundColor Yellow
Test-Endpoint "List Code Generations" "GET" "/code-gen"

# Test Deployments
Write-Host "`n--- Deployments ---" -ForegroundColor Yellow
Test-Endpoint "List Deployments" "GET" "/deployments"

# Test Analytics
Write-Host "`n--- Analytics ---" -ForegroundColor Yellow
Test-Endpoint "Get Analytics" "GET" "/analytics"
Test-Endpoint "Get Dashboard Metrics" "GET" "/analytics/metrics"

# Test Activity
Write-Host "`n--- Activity ---" -ForegroundColor Yellow
Test-Endpoint "List Activities" "GET" "/activity"

# Test Documentation
Write-Host "`n--- Documentation ---" -ForegroundColor Yellow
Test-Endpoint "List Documentation" "GET" "/documentation"

# Test Team
Write-Host "`n--- Team ---" -ForegroundColor Yellow
Test-Endpoint "List Team Members" "GET" "/team"

# Test Settings
Write-Host "`n--- Settings ---" -ForegroundColor Yellow
Test-Endpoint "Get Settings" "GET" "/settings"
Test-Endpoint "Get Profile" "GET" "/settings/profile"

# Test Integrations
Write-Host "`n--- Integrations ---" -ForegroundColor Yellow
Test-Endpoint "List Integrations" "GET" "/integrations"

# Test AI
Write-Host "`n--- AI Assistant ---" -ForegroundColor Yellow
$aiChatData = @{
    message = "Hello, AI!"
    context = "test"
}
Test-Endpoint "AI Chat" "POST" "/ai/chat" $headers $aiChatData

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Success Rate: $([math]::Round(($passed / $total) * 100, 2))%`n" -ForegroundColor White

# Detailed Results
$testResults | Format-Table -AutoSize

if ($failed -eq 0) {
    Write-Host "`n✓ All tests passed!`n" -ForegroundColor Green
} else {
    Write-Host "`n✗ Some tests failed. Check the details above.`n" -ForegroundColor Red
}
