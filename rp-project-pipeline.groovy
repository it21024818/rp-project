pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'registry.rp-project.com'
        IMAGE_NAME = 'rp-project-image’
        CONTAINER_NAME = ‘rp-project-container'
        DOCKERFILE_PATH = 'Dockerfile'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/IT21058578/rp-project.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
        }

        stage('SonarLint Test') {
            steps {
                sh 'mvn sonar:sonar'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${IMAGE_NAME}", "${DOCKERFILE_PATH}")
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    // Push Docker image to the container registry
                    docker.withRegistry("${DOCKER_REGISTRY}", 'credentials-id') {
                        docker.image("${IMAGE_NAME}").push('latest')
                    }
                }
            }
        }

        stage('Docker Container Up') {
            steps {
                script {
                    // Pull the Docker image from the registry and run the container
                    docker.withRegistry("${DOCKER_REGISTRY}", 'credentials-id') {
                        sh "docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
                        sh "docker run -d --name ${CONTAINER_NAME} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup: Remove the container if it exists
            script {
                sh "docker rm -f ${CONTAINER_NAME} || true"
            }
        }
    }
}
