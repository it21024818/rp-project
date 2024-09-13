pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/IT21058578/rp-project.git'
            }
        }
        
        stage('Dependencies') {
            steps {
                // List the contents of the root directory on the VM for verification
                sh 'ls -l /opt/rp-project'
                // sh 'ls -l /home/dinukad_racsliit/rp-project'
                
                // List the contents of the Jenkins workspace to check if the directories are created
                sh 'ls -l $WORKSPACE'
                
                // Ensure destination directories exist
                sh 'mkdir -p $WORKSPACE/main_api/assets/certs'
                sh 'mkdir -p $WORKSPACE/ml_api/models'
                
                // Copy the .env file to the main_api directory (overwrite if it exists)
                sh 'cp -f /opt/rp-project/.env $WORKSPACE/main_api/.env'
                sh 'cp -f /opt/rp-project/fe.env $WORKSPACE/web_app/.env'
                sh 'cp -f /opt/rp-project/fe.env $WORKSPACE/web_admin/.env'
                
                // Copy the certs directory to the assets directory in main_api (overwrite if it exists)
                sh 'cp -r -f /opt/rp-project/certs/* $WORKSPACE/main_api/assets/certs/'
                
                // Copy the models directory to the ml_api directory (overwrite if it exists)
                sh 'cp -r -f /opt/rp-project/models/* $WORKSPACE/ml_api/models/'
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

        // stage('Push to Registry') {
        //     steps {
        //         script {
        //             // Tag and push the images to the registry
        //             sh "docker login -u ${REGISTRY_CREDENTIALS_USR} -p ${REGISTRY_CREDENTIALS_PSW} ${REGISTRY}"
        //             sh "docker-compose images | awk '{print $2}' | grep -v ID | xargs -I {} docker tag {} ${REGISTRY}/{}:${IMAGE_TAG}"
        //             sh "docker-compose images | awk '{print $2}' | grep -v ID | xargs -I {} docker push ${REGISTRY}/{}:${IMAGE_TAG}"
        //         }
        //     }
        // }

        // stage('Pull Images from Registry') {
        //     steps {
        //         script {
        //             // Pull the images from the container registry
        //             sh "docker-compose pull"
        //         }
        //     }
        // }
        
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
                    sh 'echo "Running Tests on ML API"'
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
            cleanWs()
        }
    }
}
