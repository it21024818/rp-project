pipeline {
    agent any

    environment {
        REGISTRY = "dinuka07/rp-project"
        REGISTRY_CREDENTIALS = credentials('your-registry-credentials-id')
        IMAGE_NAME = "rp-project-image"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/IT21058578/rp-project.git'
            }
        }
        
        stage('Build Services') {
            steps {
                script {
                    // Build the Docker images
                    sh 'docker-compose build'
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    // Tag and push the images to the registry
                    sh "docker login -u ${REGISTRY_CREDENTIALS_USR} -p ${REGISTRY_CREDENTIALS_PSW} ${REGISTRY}"
                    sh "docker-compose images | awk '{print $2}' | grep -v ID | xargs -I {} docker tag {} ${REGISTRY}/{}:${IMAGE_TAG}"
                    sh "docker-compose images | awk '{print $2}' | grep -v ID | xargs -I {} docker push ${REGISTRY}/{}:${IMAGE_TAG}"
                }
            }
        }

        stage('Pull Images from Registry') {
            steps {
                script {
                    // Pull the images from the container registry
                    sh "docker-compose pull"
                }
            }
        }
        
        stage('Run Services') {
            steps {
                script {
                    // Start the services using the images from the registry
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run your tests
                    sh 'docker-compose exec ml_api python -m unittest discover -s tests -p "test_*.py"'
                }
            }
        }

        // stage('Tear Down') {
        //     steps {
        //         script {
        //             // Stop and remove the services
        //             sh 'docker-compose down'
        //         }
        //     }
        // }
    }

    post {
        always {
            sh 'clean ws'
        }
    }
}
