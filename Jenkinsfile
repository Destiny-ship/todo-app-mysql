pipeline {
    agent any

    tools {
        nodejs 'node24'
    }
    environment {
        IMAGE = 'destinyship/todo-app'
        SERVER = 'root@68.183.34.74'
    }
    triggers {
        pollSCM('H/2 * * * *')
    }
    stages {
        stage ('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage ('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build and Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh 'docker buildx build --platform linux/amd64,linux/arm64 -t $IMAGE:$BUILD_NUMBER -t $IMAGE:latest --push .'
                }
            }
        }
        stage ('Deploy') {
            steps {
                sshagent(['droplet-ssh-key']) {
                    sh 'scp -o StrictHostKeyChecking=accept-new docker-compose.yml $SERVER:/root/todo-app/'
                    sh 'ssh -o StrictHostKeyChecking=accept-new $SERVER "cd /root/todo-app && docker compose pull app && docker compose up -d"'
                }
            }
        }
        stage('Check') {
            steps {
                sh 'curl -f --retry 10 --retry-delay 3 --retry-all-errors http://68.183.34.74:3080/health'
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}

//Jenkinsfile